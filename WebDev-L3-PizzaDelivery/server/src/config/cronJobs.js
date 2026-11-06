import cron from "node-cron";
import { sendLowStockAlerts } from "../services/lowStockEmailService.js";

export const startCronJobs = () => {
  // Run every 5 minutes in background
  cron.schedule("*/5 * * * *", async () => {
    try {
      await sendLowStockAlerts();
    } catch (error) {
      console.error("Low-stock cron job error:", error.message || error);
    }
  });
};
