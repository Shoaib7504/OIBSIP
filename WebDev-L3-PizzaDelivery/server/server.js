import "dotenv/config";
import connectDB from "./src/config/db.js";
import app from "./src/app.js";
import { verifyEmailConnection } from "./src/config/email.js";
import { startCronJobs } from "./src/config/cronJobs.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    await verifyEmailConnection();

   startCronJobs();
  

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();