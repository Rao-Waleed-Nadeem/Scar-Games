// Authentication controller skeleton for email verification signup.
// Business logic is implemented in later milestones.

async function signup(req, res) {
  return res.status(501).json({
    success: false,
    message: "Not implemented",
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
