const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

// Signup: request OTP
router.post("/signup", authController.signup);

// Verify: submit OTP
router.post("/verify", authController.verifyOTP);

// Resend: request new OTP
router.post("/resend", authController.resendOTP);

module.exports = router;
