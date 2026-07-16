import crypto from "crypto";

// Keep these defaults aligned with the architecture doc/API contract.
// Signup verification expects a 300 second expiry.
const DEFAULT_OTP_LENGTH = 6;
const DEFAULT_EXPIRY_SECONDS = 300;

export const generateOTP = ({ length = DEFAULT_OTP_LENGTH } = {}) => {
  const digits = Math.max(1, Number(length) || DEFAULT_OTP_LENGTH);
  const max = 10 ** digits;
  const otpInt = crypto.randomInt(0, max);
  return String(otpInt).padStart(digits, "0");
};

export const hashOTP = (otp) => {
  if (typeof otp !== "string" || otp.length === 0) {
    throw new Error("OTP must be a non-empty string");
  }

  return crypto.createHash("sha256").update(otp).digest("hex");
};

export const compareOTP = (plainOtp, hashedOtp) => {
  if (typeof hashedOtp !== "string" || hashedOtp.length === 0) return false;
  return hashOTP(String(plainOtp)) === hashedOtp;
};

export const getExpiryTime = ({ seconds = DEFAULT_EXPIRY_SECONDS } = {}) => {
  const s = Number(seconds);
  const durationMs =
    Number.isFinite(s) && s > 0 ? s * 1000 : DEFAULT_EXPIRY_SECONDS * 1000;
  return new Date(Date.now() + durationMs);
};
