import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { requestSignupOTP } from "../user.store/userThunk";

import { toast } from "react-toastify";

const bgGradient =
  "bg-gradient-to-br from-myDarkPurple via-myPurple to-myLightBlue";
const inputStyle =
  "w-full p-3 rounded-lg bg-white/10 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-muPink";
const buttonStyle =
  "w-full py-3 mt-4 rounded-lg bg-muPink hover:bg-pink-500 transition-colors text-white font-semibold";

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

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-3.35 2.9A9.12 9.12 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 4.22-5.94" />
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    <path d="M1 1l22 22" />
  </svg>
);

// Small helper so each field can render its own red message consistently.
const FieldError = ({ message }) =>
  message ? (
    <p className="text-red-400 text-sm mt-1" role="alert">
      {message}
    </p>
  ) : null;

const usernameRegex = /^[A-Za-z][A-Za-z0-9_]{2,19}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,32}$/;

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    general: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userLoggedIn } = useSelector((state) => state.user);

  useEffect(() => {
    if (userLoggedIn) {
      const redirectTo = localStorage.getItem("redirectAfterLogin") || "/";
      localStorage.removeItem("redirectAfterLogin");

      navigate(redirectTo);
    }
  }, [userLoggedIn, navigate]);

  const clearError = (field) => {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: "" } : prev));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const fieldErrors = {
      username: "",
      email: "",
      password: "",
      general: "",
    };

    if (!usernameRegex.test(name)) {
      fieldErrors.username =
        "Username must be 3-20 characters, start with a letter, and contain only letters, numbers, and underscores.";
    }

    if (!emailRegex.test(email)) {
      fieldErrors.email = "Please enter a valid email address.";
    }

    if (!passwordRegex.test(password)) {
      fieldErrors.password =
        "Password must be 8-32 characters and include uppercase, lowercase, a number, and a special character.";
    }

    const hasError = Object.values(fieldErrors).some(Boolean);
    if (hasError) {
      setErrors(fieldErrors);
      return;
    }

    setErrors(fieldErrors);

    const formData = {
      username: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    };

    setIsSubmitting(true);
    const result = await dispatch(requestSignupOTP(formData));

    if (result.success) {
      toast.success(result.message);

      const expiresIn = Number(result.expiresIn) || 300;
      navigate("/verify-email", {
        state: {
          email: formData.email,
          expiresAt: Date.now() + expiresIn * 1000,
        },
      });
    } else {
      setIsSubmitting(false);
      toast.error(result.message);
      setErrors((prev) => ({ ...prev, general: result.message }));

      setPassword("");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${bgGradient} px-4`}
    >
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm cursor-wait">
          <div className="flex flex-col items-center gap-4 text-white">
            <div className="h-12 w-12 rounded-full border-4 border-white/30 border-t-white animate-spin" />
            <p className="font-semibold">Sending verification code...</p>
          </div>
        </div>
      )}
      <MotionWrapper>
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Sign Up
        </h1>
        <form onSubmit={handleSubmit} noValidate>
          <div>
            <input
              type="text"
              placeholder="Username"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearError("username");
              }}
              className={inputStyle}
              disabled={isSubmitting}
              required
            />
            <FieldError message={errors.username} />
          </div>

          <div className="mt-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError("email");
              }}
              className={inputStyle}
              disabled={isSubmitting}
              required
            />
            <FieldError message={errors.email} />
          </div>

          <div className="relative mt-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError("password");
              }}
              className={`${inputStyle} pr-12`}
              disabled={isSubmitting}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
              disabled={isSubmitting}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
            <FieldError message={errors.password} />
          </div>

          <FieldError message={errors.general} />

          <MotionButton
            type="submit"
            className={`${buttonStyle} cursor-pointer disabled:cursor-not-allowed disabled:opacity-70`}
            disabled={isSubmitting}
            whileHover={isSubmitting ? undefined : { scale: 1.03, y: -1 }}
            whileTap={isSubmitting ? undefined : { scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 18 }}
          >
            {isSubmitting ? "Sending..." : "Create Account"}
          </MotionButton>
        </form>
        <p className="text-white mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-myLightBlue">
            Login
          </Link>
        </p>
      </MotionWrapper>
    </div>
  );
}
