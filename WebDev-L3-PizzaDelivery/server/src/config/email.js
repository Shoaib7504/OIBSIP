import nodemailer from "nodemailer";

export const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const transporter = getTransporter();

export default transporter;

export const verifyEmailConnection = async () => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("⚠️ Warning: SMTP credentials are not configured in .env");
      return false;
    }
    const currentTransporter = getTransporter();
    await currentTransporter.verify();
    console.log("✅ Email server is ready to send messages");
    return true;
  } catch (error) {
    console.warn("⚠️ Warning: Email service connection failed:", error.message || error);
    // Non-fatal: do not crash the entire server
    return false;
  }
};
