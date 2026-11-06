import { Router } from "express";
import { protect, optionalProtect } from "../middleware/authMiddleware.js";
import {
  createCheckoutSession,
  getSessionStatus,
} from "../controllers/paymentController.js";

const router = Router();

// Logged-in customer initiates Stripe Checkout
router.post("/create-checkout-session/:orderId", protect, createCheckoutSession);

// Customer or returning checkout checks session status for payment confirmation
router.get("/session-status/:sessionId", optionalProtect, getSessionStatus);

export default router;
