// Authentication controller skeleton for email verification signup.
// Business logic is implemented in later milestones.

import { findUserByEmail, createUser } from "../models/userModel.js";
import {
  createVerification,
  deleteVerificationByEmail,
  deleteVerificationById,
  findVerificationByEmail,
} from "../models/verificationModel.js";
import bcrypt from "bcrypt";
import {
  generateOTP,
  hashOTP,
  getExpiryTime,
  compareOTP,
} from "../utils/otp.js";
import { sendVerificationOTP } from "../utils/email.js";

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateSignupBody({ username, email, password }) {
  if (!username) {
    return { ok: false, status: 400, message: "Missing username." };
  }

  if (String(username).length < 3) {
    return {
      ok: false,
      status: 400,
      message: "Username must be at least 3 characters.",
    };
  }
  if (String(username).length > 100) {
    return {
      ok: false,
      status: 400,
      message: "Username must be at most 100 characters.",
    };
  }

  if (!email) {
    return { ok: false, status: 400, message: "Missing email." };
  }
  if (!isValidEmail(email)) {
    return { ok: false, status: 400, message: "Invalid email format." };
  }

  if (!password) {
    return { ok: false, status: 400, message: "Missing password." };
  }

  if (String(password).length < 8) {
    return { ok: false, status: 400, message: "Weak password." };
  }

  return { ok: true };
}

async function signup(req, res) {
  const { username, email, password } = req.body || {};

  const validation = validateSignupBody({ username, email, password });
  if (!validation.ok) {
    return res.status(validation.status).json({
      success: false,
      message: validation.message,
    });
  }

  // Milestone M09: Duplicate email check before any OTP generation/storage.
  const existing = await findUserByEmail(email);
  if (existing) {
    return res.status(409).json({
      success: false,
      message: "Email already registered.",
    });
  }

  // Milestone M10: Generate OTP + hash + expiry (no DB save, no email send).
  const otp = generateOTP();
  const otpHash = hashOTP(otp);
  const expiresAt = getExpiryTime();

  // Milestone M11: Store verification record (OTP + password are stored hashed only).
  // The DB model expects `passwordHash`.
  const passwordHash = await bcrypt.hash(password, 10);

  const inserted = await createVerification({
    username,
    email,
    passwordHash,
    otpHash,
    expiresAt,
  });

  try {
    // Milestone M12: Send Verification Email.
    await sendVerificationOTP({
      to: email,
      otp,
      expiresInSeconds: 300,
    });

    return res.status(200).json({
      success: true,
      message: "Verification code sent.",
      email,
      expiresIn: 300,
    });
  } catch (error) {
    // Cleanup: do not leave active verification if email sending fails.
    await deleteVerificationByEmail(email);

    return res.status(500).json({
      success: false,
      message: "Failed to send verification email.",
    });
  }
}

async function verifyOTP(req, res) {
  // Milestone M14: Validate Verify OTP request before any DB calls.
  const { email, otp } = req.body || {};

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Missing email",
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email",
    });
  }

  if (otp === undefined || otp === null || otp === "") {
    return res.status(400).json({
      success: false,
      message: "Missing OTP",
    });
  }

  const otpStr = String(otp);

  // Numeric only
  if (!/^\d+$/.test(otpStr)) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP Format",
    });
  }

  // Exactly project-defined length (6 digits)
  if (otpStr.length !== 6) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP Format",
    });
  }

  // Milestone M15: Implement OTP verification logic.
  // Find verification record.
  const record = await findVerificationByEmail(email);

  if (!record) {
    return res.status(404).json({
      success: false,
      message: "Verification record not found",
    });
  }

  // Expiration check.
  const now = new Date();
  const expiresAt = record.expires_at || record.expiresAt;
  if (expiresAt && new Date(expiresAt) <= now) {
    await deleteVerificationById(
      record.verification_id || record.verificationId,
    );
    return res.status(410).json({
      success: false,
      message: "OTP expired",
    });
  }

  // Compare OTP hash.
  const otpHashFromDb = record.otp_hash || record.otpHash;
  const isMatch = compareOTP(otpStr, otpHashFromDb);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: "Incorrect OTP",
    });
  }

  // Milestone M16: Create user account.
  const usernameToCreate = record.username;
  const passwordHashToUse = record.password_hash || record.passwordHash;

  // Use default role from signup; if verification doesn't contain it, fallback to Customer.
  const roleToCreate = record.role || "Customer";

  // Create permanent user.
  const newUser = await createUser({
    username: usernameToCreate,
    email,
    password: passwordHashToUse,
    role: roleToCreate,
  });

  // Delete verification record only after successful user creation.
  await deleteVerificationById(record.verification_id || record.verificationId);

  return res.status(200).json({
    success: true,
    user: newUser,
  });
}

async function resendOTP(req, res) {
  return res.status(501).json({
    success: false,
    message: "Not implemented",
  });
}

module.exports = {
  signup,
  verifyOTP,
  resendOTP,
};
