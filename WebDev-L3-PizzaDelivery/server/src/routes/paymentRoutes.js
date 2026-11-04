import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createCheckoutSession,
  getSessionStatus,
} from "../controllers/paymentController.js";

const router = Router();

// Logged-in customer initiates Stripe Checkout
router.post("/create-checkout-session/:orderId", protect, createCheckoutSession);

// Customer checks session status for payment confirmation
router.get("/session-status/:sessionId", protect, getSessionStatus);

export default router;
