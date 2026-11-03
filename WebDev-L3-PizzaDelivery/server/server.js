import "dotenv/config";
import connectDB from "./src/config/db.js";
import app from "./src/app.js";
import { verifyEmailConnection } from "./src/config/email.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    await verifyEmailConnection();
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
