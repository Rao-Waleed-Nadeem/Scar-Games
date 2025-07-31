import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, resetUser } from "../user.store/userThunk"; // Update path based on your project
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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

export default function LogoutPage() {
  const [loggedOut, setLoggedOut] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userLoggedIn } = useSelector((state) => state.userLoggedIn); // Change selector according to your redux store

  useEffect(() => {
    if (!userLoggedIn) {
      navigate("/");
    }
  }, [userLoggedIn, navigate]);

  useEffect(() => {
    if (loggedOut) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 4000); // 4 seconds
      return () => clearTimeout(timer); // Cleanup if component unmounts
    }
  }, [loggedOut, navigate]);

  const handleLogout = async () => {
    await dispatch(resetUser());
    await dispatch(logoutUser(navigate));
    setLoggedOut(true);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${bgGradient} px-4`}
    >
      <AnimatePresence>
        {!loggedOut ? (
          <MotionWrapper>
            <h1 className="text-3xl font-bold text-white mb-6 text-center">
              Are you sure?
            </h1>
            <button
              onClick={handleLogout}
              className={`${buttonStyle} cursor-pointer `}
            >
              Yes, Log me out
            </button>
          </MotionWrapper>
        ) : (
          <MotionWrapper>
            <h1 className="text-3xl font-bold text-white text-center">
              👋 See you again soon!
            </h1>
          </MotionWrapper>
        )}
      </AnimatePresence>
    </div>
  );
}
