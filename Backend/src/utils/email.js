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
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.12);">

          <!-- Header -->
          <tr>
            <td
              style="background:linear-gradient(135deg,#0f172a,#1d4ed8);padding:35px;text-align:center;">

              <h1
                style="margin:0;font-size:34px;color:#ffffff;font-weight:800;letter-spacing:1px;">
                SCAR GAMES
              </h1>

              <p
                style="margin:10px 0 0;color:#dbeafe;font-size:15px;">
                Your Ultimate Gaming Marketplace
              </p>

            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">

              <h2
                style="margin-top:0;color:#111827;font-size:24px;">
                Verify Your Email
              </h2>

              <p
                style="font-size:16px;color:#4b5563;line-height:1.7;">
                Thank you for joining
                <strong style="color:#2563eb;">Scar Games</strong>.
                Please use the verification code below to complete your registration.
              </p>

              <div
                style="margin:35px 0;text-align:center;">

                <div
                  style="
                    display:inline-block;
                    background:#eff6ff;
                    color:#2563eb;
                    border:2px dashed #2563eb;
                    border-radius:12px;
                    padding:18px 40px;
                    font-size:34px;
                    font-weight:800;
                    letter-spacing:8px;">
                  ${otp}
                </div>

              </div>

              <p
                style="text-align:center;font-size:15px;color:#6b7280;">
                ${
                  expiresIn
                    ? `This code will expire in <strong>${Math.ceil(
                        expiresIn / 60,
                      )} minute(s)</strong>.`
                    : "This verification code is valid for a limited time."
                }
              </p>

              <hr
                style="border:none;border-top:1px solid #e5e7eb;margin:35px 0;" />

              <p
                style="font-size:14px;color:#6b7280;line-height:1.6;">
                If you didn't create an account with
                <strong>Scar Games</strong>, you can safely ignore this email.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td
              style="background:#111827;padding:25px;text-align:center;">

              <p
                style="margin:0;color:#9ca3af;font-size:13px;">
                © ${new Date().getFullYear()} Scar Games. All Rights Reserved.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;

  return sendEmail({
    to,
    subject,
    text,
    html,
  });
}

export { sendVerificationOTP, sendEmail };
