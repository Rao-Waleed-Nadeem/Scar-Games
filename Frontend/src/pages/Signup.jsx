import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../user.store/userThunk"; // adjust your path if needed

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

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userLoggedIn } = useSelector((state) => state.userLoggedIn); // Access userLoggedIn from Redux store

  // Redirect if the user is already logged in
  useEffect(() => {
    if (userLoggedIn) {
      const redirectTo = localStorage.getItem("redirectAfterLogin") || "/"; // Default to home if not available
      localStorage.removeItem("redirectAfterLogin"); // Clear the stored URL

      // Redirect to the saved page
      navigate(redirectTo);
    }
  }, [userLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      username: name,
      email,
      password,
    };

    await dispatch(registerUser(formData));
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
          Sign Up
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputStyle}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${inputStyle} mt-4`}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${inputStyle} mt-4`}
            required
          />
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
