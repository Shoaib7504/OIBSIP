
import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createCheckoutSession } from "../controllers/paymentController.js";

const router = Router();

// Logged-in customer initiates Stripe Checkout
router.post("/create-checkout-session/:orderId", protect, createCheckoutSession);

export default router;
