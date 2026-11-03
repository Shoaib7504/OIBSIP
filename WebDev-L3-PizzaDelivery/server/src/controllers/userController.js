import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import crypto from "crypto";
import transporter from "../config/email.js";
// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "default_jwt_secret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};


// Register a new user
// POST /api/users/register
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const normalizeEmail = email.trim().toLowerCase();

    const exists = await User.findOne({ email: normalizeEmail });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate secure email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Hash token before storing it in database
    const emailVerificationTokenHash = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    // Create new user
    const user = await User.create({
      name: name.trim(),
      email: normalizeEmail,
      passwordHash,
      phone: phone || "",
      address: address || {},
      isEmailVerified: false,
      emailVerificationTokenHash,
      emailVerificationExpires: Date.now() + 15 * 60 * 1000,
    });

    // Build verification link
    const verificationUrl =
      `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

    // Send verification email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: user.email,
      subject: "Verify Your Pizza Delivery Account",
      html: `
        <h2>Welcome to Pizza Delivery!</h2>
        <p>Thank you for registering.</p>
        <p>Please verify your email address by clicking below:</p>
        <a href="${verificationUrl}"
           style="display:inline-block;padding:12px 20px;background:#e63946;color:white;text-decoration:none;border-radius:6px;">
          Verify Email
        </a>
        <p>This link expires in 15 minutes.</p>
        <p>If you did not create this account, please ignore this email.</p>
      `,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please check your email to verify your account.",
    });
  } catch (err) {
    next(err);
  }
};

// Login user
//  POST /api/users/login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const normalizeEmail = email.trim().toLowerCase();

    // Find user by email and include passwordHash for comparison
    const user = await User.findOne({ email: normalizeEmail }).select("+passwordHash");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Compare entered password with stored bcrypt hash
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    // Check email verification status
    if (!user.isEmailVerified && user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in.",
      });
    }
    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login successful",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        isAdmin: user.role === "admin",
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get user profile by ID or current logged-in user
//   GET /api/users/profile or GET /api/users/:id
export const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.params.id || req.user?._id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId).select("-passwordHash");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};


// Verify user email
// GET /api/users/verify-email?token=...
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required",
      });
    }

    // Hash received token
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with matching valid token
    const user = await User.findOne({
      emailVerificationTokenHash: tokenHash,
      emailVerificationExpires: { $gt: Date.now() },
    }).select("+emailVerificationTokenHash");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification link",
      });
    }

    // Verify email and clear verification token
    user.isEmailVerified = true;
    user.emailVerificationTokenHash = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    });
  } catch (err) {
    next(err);
  }
};