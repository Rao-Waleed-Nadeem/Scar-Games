import express from "express";
// const authController = require("../controllers/authController");
import {
  signup,
  verifyOTP,
  resendOTP,
  googleAuth,
} from "../controllers/authController.js";

const router = express.Router();

// Signup: request OTP
router.post("/signup", signup);

// Verify: submit OTP
router.post("/verify", verifyOTP);

// Resend: request new OTP
router.post("/resend", resendOTP);

// Google authentication: verify Google identity token
router.post("/google", googleAuth);

export default router;
