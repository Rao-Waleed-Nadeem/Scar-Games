import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../user.store/userThunk"; // Update this path based on your project
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
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

// Simple inline eye / eye-off icons so we don't need an extra icon library.
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

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // NOTE: adjust `state.user` below if your store registers the slice under a different key.
  const { userLoggedIn } = useSelector((state) => state.user);

  // Manage form state
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  // Inline error message shown under the form
  const [errorMessage, setErrorMessage] = useState("");

  // Toggle for show/hide password
  const [showPassword, setShowPassword] = useState(false);

  // Check if the user is logged in, and if so, redirect them to the home page
  useEffect(() => {
    if (userLoggedIn) {
      const redirectTo = localStorage.getItem("redirectAfterLogin") || "/"; // Default to home if not available
      localStorage.removeItem("redirectAfterLogin"); // Clear the stored URL

      // Redirect to the saved page
      navigate(redirectTo);
    }
  }, [userLoggedIn, navigate]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    // Clear the error as soon as the user starts correcting their input
    if (errorMessage) setErrorMessage("");
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const result = await dispatch(loginUser(formData)); // Dispatch login action

    if (result.success) {
      toast.success(result.message);

      const redirectTo = localStorage.getItem("redirectAfterLogin") || "/";

      localStorage.removeItem("redirectAfterLogin");

      navigate(redirectTo);
    } else {
      toast.error(result.message);
      setErrorMessage(result.message);

      // Clear the password on failure so the user isn't tempted to resubmit
      // the same wrong value; keep the identifier so they don't have to retype it.
      setFormData((prev) => ({
        ...prev,
        identifier: "",
        password: "",
      }));
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${bgGradient} px-4`}
    >
      <MotionWrapper>
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Login
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            placeholder="Email or Username"
            className={inputStyle}
            required
          />

          <div className="relative mt-4">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className={`${inputStyle} pr-12`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          {errorMessage && (
            <p className="text-red-400 text-sm mt-2" role="alert">
              {errorMessage}
            </p>
          )}

          <button type="submit" className={`${buttonStyle} cursor-pointer`}>
            Login
          </button>
        </form>
        <p className="text-white mt-4 text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-myLightBlue">
            Sign Up
          </Link>
        </p>
      </MotionWrapper>
    </div>
  );
}
