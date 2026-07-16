import nodemailer from "nodemailer";

// Centralized email utility.
// Must never handle OTP generation/hashing or database.

const REQUIRED_SMTP_ENV = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS"];

function getMissingSmtpConfig() {
  return REQUIRED_SMTP_ENV.filter((key) => !process.env[key]);
}

function shouldUseJsonTransport() {
  return (
    process.env.EMAIL_TRANSPORT === "json" &&
    process.env.NODE_ENV !== "production"
  );
}

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const missingConfig = getMissingSmtpConfig();

  if (shouldUseJsonTransport()) {
    return nodemailer.createTransport({
      jsonTransport: true,
    });
  }

  if (missingConfig.length > 0) {
    const error = new Error(
      `Email service is not configured. Missing: ${missingConfig.join(", ")}.`,
    );
    error.code = "EMAIL_CONFIG_MISSING";
    throw error;
  }

  const secure = port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });
}

async function sendEmail({ to, subject, text, html }) {
  const transporter = createTransporter();

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || userFromEnvOrDefault(),
    to,
    subject,
    text,
    html,
  });

  if (shouldUseJsonTransport() && info.message) {
    console.log("Development email output:");
    console.log(info.message);
  }

  return info;
}

function userFromEnvOrDefault() {
  return process.env.SMTP_USER || "no-reply@example.com";
}

async function sendVerificationOTP({ to, otp, expiresInSeconds }) {
  const expiresIn = Number(expiresInSeconds);
  const minutes = Number.isFinite(expiresIn)
    ? Math.ceil(expiresIn / 60)
    : undefined;

  const subject = "Your verification code";
  const text = `Your verification code is: ${otp}${minutes ? ` (valid for ${minutes} minute(s))` : ""}.`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2 style="margin:0 0 12px;">Email verification</h2>
      <p style="margin:0 0 12px;">Your verification code is:</p>
      <p style="font-size: 22px; font-weight: 700; margin: 0 0 12px;">${otp}</p>
      <p style="margin:0;">${expiresIn ? `Valid for ${Math.ceil(expiresIn / 60)} minute(s).` : "Valid for a limited time."}</p>
    </div>
  `;

  return sendEmail({
    to,
    subject,
    text,
    html,
  });
}

export { sendVerificationOTP, sendEmail };
