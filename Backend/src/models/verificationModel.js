const db = require("../utils/db");

// Model responsibility: SQL only for EmailVerifications.

async function createVerification({
  username,
  email,
  passwordHash,
  otpHash,
  expiresAt,
}) {
  const query = `
    INSERT INTO dbo.EmailVerifications (username, email, password_hash, otp_hash, expires_at)
    OUTPUT INSERTED.verification_id
    VALUES (@username, @email, @password_hash, @otp_hash, @expires_at);
  `;

  const result = await db.query(query, {
    username,
    email,
    password_hash: passwordHash,
    otp_hash: otpHash,
    expires_at: expiresAt,
  });

  return result;
}

async function upsertVerification({
  username,
  email,
  passwordHash,
  otpHash,
  expiresAt,
}) {
  // Ensures at most one active record per email by deleting existing and inserting a new one.
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
  const query = `
    SELECT TOP 1
      verification_id,
      username,
      email,
      password_hash,
      otp_hash,
      expires_at,
      created_at
    FROM dbo.EmailVerifications
    WHERE email = @email;
  `;

  const result = await db.query(query, { email });
  return result && Array.isArray(result) ? result[0] : result;
}

async function deleteVerificationById(verificationId) {
  const query = `
    DELETE FROM dbo.EmailVerifications
    WHERE verification_id = @verification_id;
  `;

  return db.query(query, { verification_id: verificationId });
}

async function deleteVerificationByEmail(email) {
  const query = `
    DELETE FROM dbo.EmailVerifications
    WHERE email = @email;
  `;

  return db.query(query, { email });
}

async function deleteExpiredVerifications({ now = new Date() } = {}) {
  const query = `
    DELETE FROM dbo.EmailVerifications
    WHERE expires_at <= @now;
  `;

  return db.query(query, { now });
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

module.exports = {
  createVerification,
  upsertVerification,
  findVerificationByEmail,
  deleteVerificationById,
  deleteVerificationByEmail,
  deleteExpiredVerifications,
  replaceVerification,
};
