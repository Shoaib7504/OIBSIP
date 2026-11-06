import "dotenv/config";
import connectDB from "../src/config/db.js";
import app from "../src/app.js";

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (error) {
    console.error("Database connection error in serverless handler:", error);
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }

  return app(req, res);
}

