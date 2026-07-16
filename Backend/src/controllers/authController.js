import jwt from "jsonwebtoken";

import { findUserByEmail, createUser } from "../models/userModel.js";
import {
  deleteVerificationByEmail,
  deleteVerificationById,
  findVerificationByEmail,
  replaceVerification,
} from "../models/verificationModel.js";
import bcrypt from "bcrypt";
import {
  generateOTP,
  hashOTP,
  getExpiryTime,
  compareOTP,
} from "../utils/otp.js";
import { sendVerificationOTP } from "../utils/email.js";

export const isValidEmail = (email) => {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateSignupBody = ({ username, email, password }) => {
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
};

const getEmailErrorMessage = (error) => {
  if (error.code === "EMAIL_CONFIG_MISSING") {
    return error.message;
  }

  if (error.code === "EAUTH") {
    return "SMTP authentication failed. Check SMTP_USER and SMTP_PASS in Backend/.env. Gmail requires an App Password.";
  }

  return "Failed to send verification email.";
};

export const signup = async (req, res) => {
  const { username, email, password } = req.body || {};

  const validation = validateSignupBody({ username, email, password });
  if (!validation.ok) {
    return res.status(validation.status).json({
      success: false,
      message: validation.message,
    });
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return res.status(409).json({
      success: false,
      message: "Email already registered.",
    });
  }

  const otp = generateOTP();
  const otpHash = hashOTP(otp);
  const expiresAt = getExpiryTime();

  const passwordHash = await bcrypt.hash(password, 10);

  await replaceVerification({
    username,
    email,
    passwordHash,
    otpHash,
    expiresAt,
  });

  try {
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

    console.error("Failed to send verification email:", {
      code: error.code,
      message: error.message,
    });

    return res.status(500).json({
      success: false,
      message: getEmailErrorMessage(error),
    });
  }
};

export const verifyOTP = async (req, res) => {
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

  if (!/^\d+$/.test(otpStr)) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP Format",
    });
  }

  if (otpStr.length !== 6) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP Format",
    });
  }

  const record = await findVerificationByEmail(email);

  if (!record) {
    return res.status(404).json({
      success: false,
      message: "Verification record not found",
    });
  }

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

  const otpHashFromDb = record.otp_hash || record.otpHash;
  const isMatch = compareOTP(otpStr, otpHashFromDb);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: "Incorrect OTP",
    });
  }

  const usernameToCreate = record.username;
  const passwordHashToUse = record.password_hash || record.passwordHash;
  const roleToCreate = record.role || "Customer";

  const newUser = await createUser({
    username: usernameToCreate,
    email,
    password: passwordHashToUse,
    role: roleToCreate,
  });

  await deleteVerificationById(record.verification_id || record.verificationId);

  const JWT_SECRET = process.env.JWT_SECRET;

  const token = jwt.sign(
    {
      user_id: newUser.user_id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    },
    JWT_SECRET,
    {
      expiresIn: "6h",
    },
  );

  return res.status(200).json({
    success: true,
    token,
    user: newUser,
  });
};

export const resendOTP = async (req, res) => {
  const { email } = req.body || {};

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

  const record = await findVerificationByEmail(email);
  if (!record) {
    return res.status(404).json({
      success: false,
      message: "Verification record not found",
    });
  }

  const newOtp = generateOTP();
  const newOtpHash = hashOTP(newOtp);
  const newExpiresAt = getExpiryTime();

  await replaceVerification({
    username: record.username,
    email,
    passwordHash: record.password_hash || record.passwordHash,
    otpHash: newOtpHash,
    expiresAt: newExpiresAt,
  });

  try {
    await sendVerificationOTP({
      to: email,
      otp: newOtp,
      expiresInSeconds: 300,
    });
  } catch (error) {
    console.error("Failed to resend verification email:", {
      code: error.code,
      message: error.message,
    });

    return res.status(500).json({
      success: false,
      message: getEmailErrorMessage(error),
    });
  }

  return res.status(200).json({
    success: true,
    message: "New verification code sent.",
  });
};
