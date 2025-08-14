import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendWarningEmail(to, region, disease) {
  await transporter.sendMail({
    from: `"CropWise Alerts" <${process.env.EMAIL_SENDER}>`,
    to,
    subject: `⚠️ Disease Outbreak Alert in ${region}`,
    html: `
      <h2>Crop Disease Alert</h2>
      <p>A high number of <strong>${disease}</strong> cases have been detected in your region: <strong>${region}</strong>.</p>
      <p>✅ Stay updated and consider preventive measures.</p>
      <p>— Team CropWise</p>
    `,
  });
}
