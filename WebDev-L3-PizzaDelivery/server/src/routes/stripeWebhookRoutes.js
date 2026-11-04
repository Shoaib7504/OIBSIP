import { Router } from "express";
import { handleStripeWebhook } from "../controllers/stripeWebhookController.js";

const router = Router();

// Stripe webhook endpoint
router.post("/", handleStripeWebhook);

export default router;