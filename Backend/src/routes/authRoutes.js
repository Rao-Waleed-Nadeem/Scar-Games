import express from "express";
// const authController = require("../controllers/authController");
import { signup, verifyOTP, resendOTP } from "../controllers/authController.js";

const router = express.Router();

// Signup: request OTP
router.post("/signup", signup);

// Verify: submit OTP
router.post("/verify", verifyOTP);

// Resend: request new OTP
router.post("/resend", resendOTP);

export default router;
