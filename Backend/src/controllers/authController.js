// Authentication controller skeleton for email verification signup.
// Business logic is implemented in later milestones.

import { findUserByEmail } from "../models/userModel.js";
import { createVerification } from "../models/verificationModel.js";
import bcrypt from "bcrypt";
import { generateOTP, hashOTP, getExpiryTime } from "../utils/otp.js";

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

  return res.status(200).json({
    success: true,
    message: "Signup request validation passed.",
    email,
    // Return only what frontend needs for the next screen; keep extra fields stable.
    expiresAt,
    verificationId:
      inserted?.verification_id ?? inserted?.recordset?.[0]?.verification_id,
  });
}

async function verifyOTP(req, res) {
  return res.status(501).json({
    success: false,
    message: "Not implemented",
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
