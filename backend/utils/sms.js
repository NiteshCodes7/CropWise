import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env"
});

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function sendSMSAlert(to, region, disease) {
  try {
    await client.messages.create({
      body: `🚨 Alert: Crop disease '${disease}' detected in your region (${region}). Take precautions.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to, 
    });
    console.log("✅ SMS sent to:", to);
  } catch (err) {
    console.error("❌ SMS sending failed:", err.message);
  }
}
