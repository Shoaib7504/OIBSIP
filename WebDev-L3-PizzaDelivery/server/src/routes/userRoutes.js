import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  verifyEmail,
  resendVerificationEmail,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
router.get("/profile", protect, getUserProfile);
router.get("/:id", getUserProfile);

export default router;
