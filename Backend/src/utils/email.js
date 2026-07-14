const nodemailer = require("nodemailer");

// Centralized email utility.
// Must never handle OTP generation/hashing or database.

function createTransporter() {
  // Use environment variables if present; otherwise fall back to localhost SMTP.
  const host = process.env.SMTP_HOST || "localhost";
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  const secure = port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
  });
}

async function sendEmail({ to, subject, text, html }) {
  const transporter = createTransporter();

  return transporter.sendMail({
    from: process.env.EMAIL_FROM || userFromEnvOrDefault(),
    to,
    subject,
    text,
    html,
  });
}

function userFromEnvOrDefault() {
  // If EMAIL_FROM is not configured, fall back to a generic sender.
  return "no-reply@example.com";
}

async function sendVerificationOTP({ to, otp, expiresInSeconds }) {
  const expiresIn = Number(expiresInSeconds);
  const minutes = Number.isFinite(expiresIn)
    ? Math.ceil(expiresIn / 60)
    : undefined;

  const subject = "Your verification code";
  const text = `Your verification code is: ${otp}${minutes ? ` (valid for ${minutes} minute(s))` : ""}.`;

  // Simple HTML without manual template systems.
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

module.exports = {
  sendVerificationOTP,
  sendEmail,
};
