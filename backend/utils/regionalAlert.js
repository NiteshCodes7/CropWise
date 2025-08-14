import cron from "node-cron";
import { GlobalDiagnosis } from "../models/globalDiagnosis.model.js";
import { sendWarningEmail } from "./mail.js";
import { sendSMSAlert } from "./sms.js"
import dotenv from 'dotenv';

dotenv.config({
  path: "./.env"
})

console.log("✅ Cron file loaded");

// Run every 6 hours
cron.schedule("0 */6 * * *", async () => {
  console.log("🚨 Running region-based disease alert cron job...");

  try {
    // Step 1: Aggregate recent diagnoses (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    function formatPhoneNumber(phone) {

      const phoneStr = String(phone).trim();

      return phoneStr.startsWith('+')
        ? phoneStr
        : '+' + phoneStr.replace(/^0+/, '');
    }


    const diagnoses = await GlobalDiagnosis.aggregate([
      {
        $match: {
          createdAt: { $gte: oneDayAgo },
          status: "Diseased"
        }
      },
      {
        // Group by region, disease, and userId to get distinct user submissions
        $group: {
          _id: {
            region: "$location.district",
            disease: "$prediction",
            userId: "$userId"
          }
        }
      },
      {
        // Group again to count unique users per (region + disease)
        $group: {
          _id: {
            region: "$_id.region",
            disease: "$_id.disease"
          },
          uniqueUserCount: { $sum: 1 }
        }
      }
    ]);


    console.log("Diagnoses found:", diagnoses);

    // Step 2: For each region with over 100 cases, send alerts
    for (const region of diagnoses) {
      if (region.uniqueUserCount >= 2) {

        const seenEmails = new Set();
        const seenPhone = new Set();

        const users = await GlobalDiagnosis.find({ "location.district": region._id.region });

        for (const user of users) {
          if (user.email && !seenEmails.has(user.email)) {
            await sendWarningEmail(user.email, region._id.region, region._id.disease);
            seenEmails.add(user.email);
            console.log(`Email sent to ${user.email}`)
          }
           else {
            console.warn(`⚠️ No email found for user ${user._id.userId}`);
          }

          const phone = formatPhoneNumber(user.phone);

          // if(phone && !seenPhone.has(phone)){
          //   await sendSMSAlert(phone, region._id.region, region._id.disease);
          //   seenPhone.add(phone);
          //   console.log(`SMS sent to ${phone}`)
          // }else {
          //   console.warn(`⚠️ No phone found for user ${user._id.userId}`);
          // }
        }
      }

    }
  } catch (err) {
    console.error("⚠️ Error in region alert cron job:", err);
  }
});
