import cron from "node-cron";
import { sendLowStockAlerts } from "../services/lowStockEmailService.js";

export const startCronJobs = () => {
  // Run every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    console.log("Running low-stock inventory check...");

    try {
      await sendLowStockAlerts();
    } catch (error) {
      console.error("Low-stock cron job failed:", error);
    }
  });

  console.log("Low-stock cron job scheduled successfully.");
};