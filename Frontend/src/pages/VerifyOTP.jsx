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

const pendingVerificationStorageKey = "pendingSignupVerification";

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

  const storedVerification = useMemo(() => {
    try {
      const raw = sessionStorage.getItem(pendingVerificationStorageKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const stateEmail = location.state?.email;
  const stateExpiresAt = location.state?.expiresAt;

  const { otpLoading, otpError, resendLoading } = useSelector((s) => s.user);

  const email = stateEmail || storedVerification?.email || "";

  const [otp, setOtp] = useState("");
  const [localOtpError, setLocalOtpError] = useState("");
  const [localCountdown, setLocalCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [localExpiresAtMs, setLocalExpiresAtMs] = useState(() => {
    if (typeof stateExpiresAt === "number") return stateExpiresAt;
    if (stateExpiresAt) {
      const parsed = new Date(stateExpiresAt).getTime();
      if (!Number.isNaN(parsed)) return parsed;
    }
    if (typeof storedVerification?.expiresAt === "number") {
      return storedVerification.expiresAt;
    }
    if (storedVerification?.expiresAt) {
      const parsed = new Date(storedVerification.expiresAt).getTime();
      if (!Number.isNaN(parsed)) return parsed;
    }
    return 0;
  });

  const expiresAtMs = useMemo(() => {
    if (typeof stateExpiresAt === "number") return stateExpiresAt;
    if (stateExpiresAt) {
      const stateDate = new Date(stateExpiresAt);
      if (!Number.isNaN(stateDate.getTime())) return stateDate.getTime();
    }
    if (!storedVerification?.expiresAt) return null;
    if (typeof storedVerification.expiresAt === "number") {
      return storedVerification.expiresAt;
    }
    const d = new Date(storedVerification.expiresAt);
    return Number.isNaN(d.getTime()) ? null : d.getTime();
  }, [stateExpiresAt, storedVerification]);

  const isExpired = localCountdown <= 0;

  useEffect(() => {
    if (!email || !localExpiresAtMs) {
      toast.error("Please sign up before verifying your email.");
      navigate("/signup", { replace: true });
    }
  }, [email, localExpiresAtMs, navigate]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem(pendingVerificationStorageKey);
    };
  }, []);

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
      const message = "Missing email. Please sign up again.";
      setLocalOtpError(message);
      toast.error(message);
      return;
    }

    if (isExpired) {
      const message = "Verification code expired. Please resend the code.";
      setLocalOtpError(message);
      toast.error(message);
      return;
    }

    if (otp.length !== 6) {
      const message = "Enter the 6-digit verification code.";
      setLocalOtpError(message);
      toast.error(message);
      return;
    }

    setLocalOtpError("");
    const result = await dispatch(verifySignupOTP({ email, otp }));

    if (result.success) {
      toast.success("Verified successfully.");
      sessionStorage.removeItem(pendingVerificationStorageKey);
      navigate(localStorage.getItem("redirectAfterLogin") || "/", {
        replace: true,
      });
    } else {
      const message = result.message || "OTP verification failed";
      setLocalOtpError(message);
      toast.error(message);
    }
  };

  const handleResend = async () => {
    if (isResending) return;

    if (!email) {
      toast.error("Missing email. Please sign up again.");
      return;
    }

    setIsResending(true);
    const result = await dispatch(resendSignupOTP({ email }));
    if (result.success) {
      toast.success(result.message || "New code sent.");
      setOtp("");
      setLocalOtpError("");
      const expiresAt = Date.now() + 300 * 1000;
      setLocalExpiresAtMs(expiresAt);
      sessionStorage.setItem(
        pendingVerificationStorageKey,
        JSON.stringify({ email, expiresAt }),
      );
    } else {
      toast.error(result.message || "Failed to resend code");
    }
    setIsResending(false);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${bgGradient} px-4`}
    >
      {isResending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm cursor-wait">
          <div className="flex flex-col items-center gap-4 text-white">
            <div className="h-12 w-12 rounded-full border-4 border-white/30 border-t-white animate-spin" />
            <p className="font-semibold">Sending new verification code...</p>
          </div>
        </div>
      )}
      <MotionWrapper>
        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          Verify Email
        </h1>
        <p className="text-white/80 text-center mb-6">
          {isExpired ? "Your verification code expired for " : "Enter the 6-digit code sent to "}
          <span className="font-semibold">{email}</span>
        </p>

        <form onSubmit={handleVerify} noValidate>
          {!isExpired && (
            <div>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "");
                  setOtp(v.slice(0, 6));
                  setLocalOtpError("");
                }}
                onBeforeInput={(e) => {
                  if (e.data && !/^\d+$/.test(e.data)) {
                    e.preventDefault();
                  }
                }}
                onPaste={(e) => {
                  const pasted = e.clipboardData.getData("text");
                  if (!/^\d+$/.test(pasted)) {
                    e.preventDefault();
                    setLocalOtpError("OTP must contain numbers only.");
                  }
                }}
                className={inputStyle}
                maxLength={6}
                pattern="[0-9]*"
                required
              />
            </div>
          )}

          <div className="mt-2 text-white/70 text-center">
            {localCountdown > 0 ? (
              <span>Time remaining: {formatSeconds(localCountdown)}</span>
            ) : (
              <span>Code expired. You can resend.</span>
            )}
          </div>

          <FieldError message={localOtpError || otpError} />

          {!isExpired && (
            <MotionButton
              type="submit"
              className={
                buttonStyle +
                " cursor-pointer disabled:cursor-not-allowed" +
              (otpLoading || isResending ? " opacity-60" : "")
            }
              disabled={otpLoading || isResending}
              whileHover={
                otpLoading || isResending ? undefined : { scale: 1.03, y: -1 }
              }
              whileTap={
                otpLoading || isResending ? undefined : { scale: 0.98 }
              }
              transition={{ type: "spring", stiffness: 380, damping: 18 }}
            >
              {otpLoading ? "Verifying..." : "Verify"}
            </MotionButton>
          )}

          <MotionButton
            type="button"
            className={
              (isExpired ? buttonStyle : secondaryButtonStyle) +
              " cursor-pointer disabled:cursor-not-allowed" +
              (resendLoading || isResending ? " opacity-60" : "")
            }
            onClick={handleResend}
            disabled={resendLoading || isResending}
            whileHover={
              resendLoading || isResending ? undefined : { scale: 1.03, y: -1 }
            }
            whileTap={
              resendLoading || isResending ? undefined : { scale: 0.98 }
            }
            transition={{ type: "spring", stiffness: 380, damping: 18 }}
          >
            {resendLoading ? "Resending..." : "Resend code"}
          </MotionButton>
        </form>
      </MotionWrapper>
    </div>
  );
}
