import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../user.store/userThunk"; // Update this path based on your project
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

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

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userLoggedIn } = useSelector((state) => state.userLoggedIn); // Access userLoggedIn from the Redux store

  // Manage form state
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

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
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData)); // Dispatch login action
    const redirectTo = localStorage.getItem("redirectAfterLogin") || "/"; // Default to home if not available
    localStorage.removeItem("redirectAfterLogin"); // Clear the stored URL

    // Redirect to the saved page
    navigate(redirectTo);
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
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className={`${inputStyle} mt-4`}
            required
          />
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
