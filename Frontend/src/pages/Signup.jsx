import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../user.store/userThunk"; // adjust your path if needed
import { toast } from "react-toastify";

const bgGradient =
  "bg-gradient-to-br from-myDarkPurple via-myPurple to-myLightBlue";
const inputStyle =
  "w-full p-3 rounded-lg bg-white/10 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-muPink";
const buttonStyle =
  "w-full py-3 mt-4 rounded-lg bg-muPink hover:bg-pink-500 transition-colors text-white font-semibold";

const MotionWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
    className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-md"
  >
    {children}
  </motion.div>
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

  // One error slot per field, plus a general slot for server-side failures
  // (e.g. "User already exists").
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    general: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // NOTE: adjust `state.user` below if your store registers the slice under a different key.
  const { userLoggedIn } = useSelector((state) => state.user);

  // Redirect if the user is already logged in
  useEffect(() => {
    if (userLoggedIn) {
      const redirectTo = localStorage.getItem("redirectAfterLogin") || "/"; // Default to home if not available
      localStorage.removeItem("redirectAfterLogin"); // Clear the stored URL

      // Redirect to the saved page
      navigate(redirectTo);
    }
  }, [userLoggedIn, navigate]);

  const clearError = (field) => {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: "" } : prev));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    setErrors(fieldErrors); // clear any stale errors

    const formData = {
      username: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    };

    const result = await dispatch(registerUser(formData));

    if (result.success) {
      toast.success(result.message);

      const redirectTo = localStorage.getItem("redirectAfterLogin") || "/";

      localStorage.removeItem("redirectAfterLogin");

      navigate(redirectTo);
    } else {
      toast.error(result.message);
      setErrors((prev) => ({ ...prev, general: result.message }));

      // Clear password on failure; keep username/email so the user doesn't retype them.
      setPassword("");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${bgGradient} px-4`}
    >
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
              required
            />
            <FieldError message={errors.email} />
          </div>

          <div className="mt-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError("password");
              }}
              className={inputStyle}
              required
            />
            <FieldError message={errors.password} />
          </div>

          <FieldError message={errors.general} />

          <button type="submit" className={`${buttonStyle} cursor-pointer`}>
            Create Account
          </button>
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
