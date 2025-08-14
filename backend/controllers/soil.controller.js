import { GoogleGenerativeAI } from "@google/generative-ai";
import { soilTest } from "../models/soil.model.js";
import cloudinary from "../utils/cloudinary.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

let publicId;

export const soilFertility = async (req, res) => {
    const userId = req.auth.userId;

    try {
        const imageBuffer = req.file?.buffer;
        if (!imageBuffer) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: "crop-soil" },
            (error, result) => {
            if (error) reject(error);
            else resolve(result);
            }
        ).end(imageBuffer);
        });

        const imageUrl = uploadResult.secure_url;

        publicId = uploadResult.public_id;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `You are an expert agronomist. Critically analyze the soil image and reply strictly in JSON format. Include:
                            {
                            "type": "Type of soil (e.g. sandy, clay, loamy, silty, peaty, chalky)",
                            "score": "Fertility score from 1 (very poor) to 10 (very fertile)",
                            "tip": "Practical and relevant improvement tips based on visible issues"
                            }
                            Do not assume all soils are healthy. If signs of dryness, cracks, or discoloration are visible, lower the fertility score accordingly. Strictly output only valid JSON with no extra text.`,

                        },
                        {
                            inlineData: {
                                mimeType: "image/jpeg", 
                                data: imageBuffer.toString("base64"),
                            },
                        },
                    ],
                },
            ],
        });

        const responseText = await result.response.text();

        // Try extracting the first valid JSON object using regex
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return res.status(500).json({
                error: "Failed to extract JSON from Gemini response",
                raw: responseText,
            });
        }

        const json = JSON.parse(jsonMatch[0]);

        await soilTest.create({
            userId: userId,
            type: json.type,
            score: json.score,
            tip: json.tip,
            imageUrl
        })

        return res.status(200).json(json);

    } catch (err) {
        console.error("❌ SoilFertility error:", err);
        res.status(500).json({
            error: "Gemini parsing error",
            message: err.message,
        });
        if (publicId) {
            await cloudinary.uploader.destroy(publicId);
        }
    }
};

export const soilHistory = async (req, res) => {
    
}

export const resolveSoilHistory = async (req, res) => {
    const id = req.params.id;
}