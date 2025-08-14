import axios from "axios";
import { Diagnosis } from "../models/Diagnosis.model.js";
import { GlobalDiagnosis } from "../models/globalDiagnosis.model.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClerkClient } from "@clerk/backend";


dotenv.config({
  path: './.env'
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


let publicId;

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});


export async function getUserContactInfo(userId) {
  try {
    if (!userId) throw new Error("User ID is missing");

    const user = await clerkClient.users.getUser(userId);

    const email = user?.emailAddresses?.[0]?.emailAddress || null;
    const phone = user?.phoneNumbers?.[0]?.phoneNumber || null;

    return { email, phone };
  } catch (error) {
    console.error(`❌ Failed to fetch contact info for user ${userId}:`, error.message);
    return { email: null, phone: null };
  }
}


export const uploadImageAndDiagnose = async (req, res) => {
  const tempDir = path.join(process.cwd(), "temp");  //process.cwd() --> current working directory
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  const localPath = path.join(tempDir, req.file.originalname); 
  await fs.promises.writeFile(localPath, req.file.buffer);

  try {
    const cloudResult = await cloudinary.uploader.upload(localPath, {
      folder: "crop-diagnosis",
    });

    const imageUrl = cloudResult.secure_url;
    publicId = cloudResult.public_id;

    let predictedDisease = "Unknown";
    let confidenceDisease = 0;

    try {
      const { data } = await axios.post(
        "https://serverless.roboflow.com/crop-disease-2rilx/1",
        null,
        {
          params: {
            api_key: process.env.ROBOFLOW_API_KEY,
            image: imageUrl,
          },
        }
      );

      if (data?.predictions?.length > 0) {
        predictedDisease = data.predictions[0]?.class || "Unknown";
        confidenceDisease = Math.floor(Number(data.predictions[0]?.confidence) * 100);
      } else {
        throw new Error("No predictions from Roboflow");
      }

    } catch (roboflowErr) {
      console.warn("⚠️ Roboflow failed, using Gemini fallback:", roboflowErr.message);
      const imageBase64 = fs.readFileSync(localPath, { encoding: "base64" });
      const geminiResult = await diagnoseWithGemini(imageBase64);
      predictedDisease = geminiResult.prediction || "Unknown";
      confidenceDisease = Number.isFinite(geminiResult.confidence)
        ? Math.floor(geminiResult.confidence)
        : 50;
    }

    const solution = await getGeminiSolution(predictedDisease);
    const { region, district } = await getRegionDistrict(req.body.lat, req.body.lng);
    const { email, phone } = await getUserContactInfo(req.auth.userId);

    const record = await Diagnosis.create({
      userId: req.auth.userId,
      filename: req.file.originalname,
      imageUrl,
      prediction: predictedDisease,
      confidence: confidenceDisease,
      solution,
      email,
      phone,
      location: {
        lat: req.body.lat,
        lng: req.body.lng,
        region: region || "Unknown",
        district: district || "Unknown",
      },
    });

    await GlobalDiagnosis.create({
      userId: req.auth.userId,
      email,
      phone,
      crop: predictedDisease,
      prediction: predictedDisease,
      status: "Diseased",
      imageUrl,
      location: {
        lat: req.body.lat,
        lng: req.body.lng,
        region: region || "Unknown",
        district: district || "Unknown",
      },
    });

    fs.unlinkSync(localPath);
    return res.status(200).json(record);
  } catch (err) {
    console.error("Diagnosis failed:", err);

    if (publicId) await cloudinary.uploader.destroy(publicId);
    if (fs.existsSync(localPath)) fs.unlinkSync(localPath);

    return res.status(500).json({ message: "Diagnosis failed", error: err.message });
  }
};


//Gemini fallback
const diagnoseWithGemini = async (imageBase64) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
                You are an expert agricultural plant disease identifier.

                Based on the given image, identify the crop disease name and your confidence level (as percentage 0–100). Respond ONLY in this exact JSON format:

                {
                  "prediction": "Disease name or Unknown",
                  "confidence": 85
                }

                Only return valid JSON. Do not include explanations, text, or markdown.
                `,
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: imageBase64,
              },
            },
          ]
        }]
    });

    const response = await result.response;
    const text = response.text();

    // Extract and parse JSON
    const match = text.match(/\{[\s\S]*?\}/);
    if (match) {
      return JSON.parse(match[0]);
    } else {
      console.warn("Gemini returned invalid format:", text);
      return { prediction: "Unknown", confidence: 50 };
    }

  } catch (err) {
    console.error("Gemini fallback failed:", err);
    return { prediction: "Unknown", confidence: 50 };
  }
};



//Reverse Geocoding
export async function getRegionDistrict(lat, lng) {
  try {
    const apiKey = process.env.OPENCAGE_API_KEY;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;
    const res = await axios.get(url);

    const components = res.data.results[0].components;

    const region = components.state || components.region || "";
    const district = components.county || components.city_district || components.city || "";

    return { region, district };
  } catch (error) {
    console.error("Reverse geocoding failed:", error.message);
    return { region: "Unknown", district: "Unknown" };
  }
}


export const getDiagnosisHistory = async (req, res) => {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const records = await Diagnosis.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json(records);

  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch history", error: err.message });
  }
};

export const resolveDisease = async (req, res) => {
  const { id } = req.params;

  try {
    const record = await Diagnosis.findById(id);
    if (!record || record.userId !== req.auth.userId) {
      return res.status(403).json({ message: "Unauthorized or not found" });
    }

    await Diagnosis.findByIdAndDelete(id);
    await GlobalDiagnosis.findOneAndDelete({ imageUrl: record.imageUrl, location: record.location });

    return res
      .status(200)
      .json({ message: "Disease record resolved and deleted." });

  } catch (err) {
    res.status(500).json({ message: "Failed to resolve", error: err.message });
  }
}

export const getGeminiSolution = async (diseaseName) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {

            text: `You are an expert crop doctor. Based on the diagnosis: "${diseaseName}", provide the solution in the following **exact format** using Markdown with ** for bold labels:

      Return the output as:

      **Disease**: <name of the disease or write "Healthy">

      **Symptoms**: <comma-separated list of symptoms or "None">

      **Cause**: <short explanation of the cause or "None">

      **Treatment**: <treatments or write "No treatment needed">

      **Prevention**: <optional but useful prevention tips or "None">

      Respond **strictly in this format** without any extra comments, greetings, or lines.
      `,
          }]
      }
    ]
  });

  const response = await result.response;
  const text = response.text();
  
  console.log(text);
  return text;
}
