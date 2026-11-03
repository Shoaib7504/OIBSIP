import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import crypto from "crypto";
import transporter, { getTransporter } from "../config/email.js";
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
        message:
          "Invalid or expired verification link. If you already verified your email, please proceed to login.",
      });
    }

    // Verify email (idempotent: keeps token valid for its 15m window to avoid StrictMode/refresh race condition)
    if (!user.isEmailVerified) {
      user.isEmailVerified = true;
      await user.save();
    }

    // Auto-login: generate JWT token and return session data
    const authToken = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully! Welcome to PizzaCrave.",
      token: authToken,
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

// Resend email verification link
// POST /api/users/resend-verification
export const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required",
      });
    }

    const normalizeEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizeEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email address.",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "This account's email is already verified. You can log in directly.",
      });
    }

    // Generate new secure email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const emailVerificationTokenHash = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    user.emailVerificationTokenHash = emailVerificationTokenHash;
    user.emailVerificationExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const verificationUrl = `${clientUrl}/verify-email?token=${verificationToken}`;

    const mailer = getTransporter ? getTransporter() : transporter;
    await mailer.sendMail({
      from: process.env.SMTP_USER,
      to: user.email,
      subject: "Verify Your Pizza Delivery Account",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #E8D595; border-radius: 12px; background: #FFFDF7;">
          <h2 style="color: #941508; margin-bottom: 8px;">Welcome to PizzaCrave!</h2>
          <p style="color: #351B17; font-size: 15px; line-height: 1.5;">Please verify your email address to activate your account and start ordering:</p>
          <div style="margin: 24px 0;">
            <a href="${verificationUrl}"
               style="display: inline-block; padding: 14px 28px; background: #941508; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
              Verify Email Address
            </a>
          </div>
          <p style="color: #786C55; font-size: 13px;">This verification link will expire in 15 minutes.</p>
          <hr style="border: 0; border-top: 1px solid #E8D595; margin: 20px 0;" />
          <p style="color: #786C55; font-size: 12px;">If you did not sign up for PizzaCrave, please disregard this email.</p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Verification email resent successfully. Please check your inbox.",
    });
  } catch (err) {
    next(err);
  }
};

// Forgot password
// POST /api/users/forgot-password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide your email address",
      });
    }

    const normalizeEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizeEmail });

    // Generic response prevents email enumeration
    const successMessage =
      "If an account exists with this email, a password reset link has been sent.";

    if (!user) {
      return res.status(200).json({
        success: true,
        message: successMessage,
      });
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Store only the hashed token
    user.passwordResetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Token expires in 15 minutes
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetUrl =
      `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    try {
      const mailer = getTransporter ? getTransporter() : transporter;
      await mailer.sendMail({
        from: process.env.SMTP_USER,
        to: user.email,
        subject: "Reset Your Pizza Delivery Password",
        html: `
          <h2>Password Reset Request</h2>
          <p>We received a request to reset your password.</p>
          <p>Click the button below to create a new password:</p>

          <a href="${resetUrl}"
             style="display:inline-block;padding:12px 20px;background:#e63946;color:white;text-decoration:none;border-radius:6px;">
            Reset Password
          </a>

          <p>This link expires in 15 minutes.</p>
          <p>If you did not request a password reset, please ignore this email.</p>
        `,
      });
    } catch (emailError) {
      user.passwordResetTokenHash = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      throw emailError;
    }

    return res.status(200).json({
      success: true,
      message: successMessage,
    });
  } catch (err) {
    next(err);
  }
};

// Reset password
// POST /api/users/reset-password
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Hash received reset token
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with a valid, unexpired reset token
    const user = await User.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+passwordResetTokenHash +passwordResetExpires");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset link",
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);

    // Clear reset token after successful password change
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful. Please log in with your new password.",
    });
  } catch (err) {
    next(err);
  }
};