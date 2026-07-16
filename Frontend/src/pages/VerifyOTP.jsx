import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { verifySignupOTP, resendSignupOTP } from "../user.store/userThunk";
import { toast } from "react-toastify";

const bgGradient =
  "bg-gradient-to-br from-myDarkPurple via-myPurple to-myLightBlue";
const inputStyle =
  "w-full p-3 rounded-lg bg-white/10 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-muPink";
const buttonStyle =
  "w-full py-3 mt-4 rounded-lg bg-muPink hover:bg-pink-500 transition-colors text-white font-semibold";
const secondaryButtonStyle =
  "w-full py-3 mt-3 rounded-lg bg-white/10 hover:bg-white/15 transition-colors text-white font-semibold";

const MotionDiv = motion.div;
const MotionButton = motion.button;

const MotionWrapper = ({ children }) => (
  <MotionDiv
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
    className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-md"
  >
    {children}
  </MotionDiv>
);

const FieldError = ({ message }) =>
  message ? (
    <p className="text-red-400 text-sm mt-2" role="alert">
      {message}
    </p>
  ) : null;

function formatSeconds(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function VerifyOTP() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const stateEmail = location.state?.email;
  const stateExpiresAt = location.state?.expiresAt;

  const { signupEmail, otpLoading, otpError, resendLoading, otpExpiry } =
    useSelector((s) => s.user);

  const email = stateEmail || signupEmail || "";

  const [otp, setOtp] = useState("");
  const [localCountdown, setLocalCountdown] = useState(0);
  const [localExpiresAtMs, setLocalExpiresAtMs] = useState(() => {
    if (typeof stateExpiresAt === "number") return stateExpiresAt;
    if (stateExpiresAt) {
      const parsed = new Date(stateExpiresAt).getTime();
      if (!Number.isNaN(parsed)) return parsed;
    }
    return Date.now() + 300 * 1000;
  });

  const expiresAtMs = useMemo(() => {
    if (typeof stateExpiresAt === "number") return stateExpiresAt;
    if (stateExpiresAt) {
      const stateDate = new Date(stateExpiresAt);
      if (!Number.isNaN(stateDate.getTime())) return stateDate.getTime();
    }
    if (!otpExpiry) return null;
    if (typeof otpExpiry === "number") return otpExpiry;
    const d = new Date(otpExpiry);
    return Number.isNaN(d.getTime()) ? null : d.getTime();
  }, [otpExpiry, stateExpiresAt]);

  useEffect(() => {
    if (typeof expiresAtMs === "number") {
      setLocalExpiresAtMs(expiresAtMs);
    }
  }, [expiresAtMs]);

  useEffect(() => {
    const update = () => {
      const diffSeconds = Math.ceil((localExpiresAtMs - Date.now()) / 1000);
      setLocalCountdown(Math.max(0, diffSeconds));
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [localExpiresAtMs]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Missing email. Please sign up again.");
      return;
    }

    if (otp.length !== 6) {
      toast.error("Enter the 6-digit verification code.");
      return;
    }

    const result = await dispatch(verifySignupOTP({ email, otp }));

    if (result.success) {
      toast.success("Verified successfully.");
      navigate(localStorage.getItem("redirectAfterLogin") || "/");
    } else {
      toast.error(result.message || "OTP verification failed");
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Missing email. Please sign up again.");
      return;
    }

    const result = await dispatch(resendSignupOTP({ email }));
    if (result.success) {
      toast.success(result.message || "New code sent.");
      setOtp("");
      setLocalExpiresAtMs(Date.now() + 300 * 1000);
    } else {
      toast.error(result.message || "Failed to resend code");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${bgGradient} px-4`}
    >
      <MotionWrapper>
        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          Verify Email
        </h1>
        <p className="text-white/80 text-center mb-6">
          Enter the 6-digit code sent to{" "}
          <span className="font-semibold">{email}</span>
        </p>

        <form onSubmit={handleVerify} noValidate>
          <div>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "");
                setOtp(v.slice(0, 6));
              }}
              className={inputStyle}
              required
            />
          </div>

          <div className="mt-2 text-white/70 text-center">
            {localCountdown > 0 ? (
              <span>Time remaining: {formatSeconds(localCountdown)}</span>
            ) : (
              <span>Code expired. You can resend.</span>
            )}
          </div>

          <FieldError message={otpError} />

          <MotionButton
            type="submit"
            className={
              buttonStyle +
              " cursor-pointer disabled:cursor-not-allowed" +
              (otpLoading ? " opacity-60" : "")
            }
            disabled={otpLoading}
            whileHover={otpLoading ? undefined : { scale: 1.03, y: -1 }}
            whileTap={otpLoading ? undefined : { scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 18 }}
          >
            {otpLoading ? "Verifying..." : "Verify"}
          </MotionButton>

          <MotionButton
            type="button"
            className={
              secondaryButtonStyle +
              " cursor-pointer disabled:cursor-not-allowed" +
              (resendLoading ? " opacity-60" : "")
            }
            onClick={handleResend}
            disabled={resendLoading}
            whileHover={resendLoading ? undefined : { scale: 1.03, y: -1 }}
            whileTap={resendLoading ? undefined : { scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 18 }}
          >
            {resendLoading ? "Resending..." : "Resend code"}
          </MotionButton>
        </form>
      </MotionWrapper>
    </div>
  );
}
