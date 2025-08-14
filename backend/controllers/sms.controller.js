import { Diagnosis } from "../models/Diagnosis.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import twilio from "twilio";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const smsOffline = async (req, res) => {
  const incomingMsg = req.body.Body?.toUpperCase().trim();
  const from = req.body.From;
  const normalizedPhone = from.replace(/\s+/g, '').trim();

  try {
    const user = await Diagnosis.findOne({ phone: normalizedPhone });
    if (!user) {
      await twilioClient.messages.create({
        body: "🚫 Access denied. Please register on the CropWise app to use SMS features.",
        from: process.env.TWILIO_PHONE_NUMBER,
        to: from,
      });
      return res.status(200).send("Blocked unregistered number");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    let reply = "Invalid format. Use: CROP <crop> <location> or SYM <crop> <symptom>.";

    if (incomingMsg.startsWith("CROP")) {
      const [, crop, location] = incomingMsg.split(" ");
      const prompt = `Give 2-line farming advice for ${crop} in ${location}.`;
      const result = await model.generateContent(prompt);
      reply = result.response.text();
    }

    await twilioClient.messages.create({
      body: reply,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: from,
    });

    console.log("📨 SMS received from:", from, "Message:", incomingMsg);
    res.status(200).send("Replied to registered user");
  } catch (error) {
    console.error("❌ Cannot send message", error);
    res.status(500).send("Internal server error");
  }
};

export default smsOffline;
