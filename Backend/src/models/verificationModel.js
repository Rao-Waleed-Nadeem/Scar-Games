import { sql } from "../utils/db.js";

// Model responsibility: SQL only for EmailVerifications.

async function createVerification({
  username,
  email,
  passwordHash,
  otpHash,
  expiresAt,
}) {
  const result = await sql.query`
    INSERT INTO dbo.EmailVerifications
      (username, email, password_hash, otp_hash, expires_at)
    OUTPUT INSERTED.verification_id
    VALUES
      (${username}, ${email}, ${passwordHash}, ${otpHash}, ${expiresAt});
  `;

  return result.recordset[0];
}

async function upsertVerification({
  username,
  email,
  passwordHash,
  otpHash,
  expiresAt,
}) {
  await deleteVerificationByEmail(email);
  return createVerification({
    username,
    email,
    passwordHash,
    otpHash,
    expiresAt,
  });
}

async function findVerificationByEmail(email) {
  const result = await sql.query`
    SELECT TOP 1
      verification_id,
      username,
      email,
      password_hash,
      otp_hash,
      expires_at,
      created_at
    FROM dbo.EmailVerifications
    WHERE email = ${email};
  `;

  return result.recordset[0];
}

async function deleteVerificationById(verificationId) {
  return await sql.query`
    DELETE FROM dbo.EmailVerifications
    WHERE verification_id = ${verificationId};
  `;
}

async function deleteVerificationByEmail(email) {
  return await sql.query`
    DELETE FROM dbo.EmailVerifications
    WHERE email = ${email};
  `;
}

async function deleteExpiredVerifications({ now = new Date() } = {}) {
  return await sql.query`
    DELETE FROM dbo.EmailVerifications
    WHERE expires_at <= ${now};
  `;
}

async function replaceVerification({
  username,
  email,
  passwordHash,
  otpHash,
  expiresAt,
}) {
  return upsertVerification({
    username,
    email,
    passwordHash,
    otpHash,
    expiresAt,
  });
}

export {
  createVerification,
  upsertVerification,
  findVerificationByEmail,
  deleteVerificationById,
  deleteVerificationByEmail,
  deleteExpiredVerifications,
  replaceVerification,
};
