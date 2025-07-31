import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { clearAll } from "../cart.store/cartThunk";
import { logoutUser } from "../user.store/userThunk"; // Assuming you have a logoutUser action

export default function Header() {
  const { userLoggedIn, user } = useSelector((state) => state.user); // Adjusted for correct state access
  const dispatch = useDispatch();
  console.log("user: ", user);
  const handleLogout = () => {
    dispatch(logoutUser()); // Call the logout action to clear the user's session
    dispatch(clearAll()); // Optional: clear cart on logout
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 bg-gradient-to-r from-myDarkPurple via-[#4b2e83] to-[#497cc9] text-white px-6 py-4 shadow-2xl backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 hover:scale-105 transition-transform duration-300"
        >
          🎮 Scar Games
        </Link>
        <nav className="flex flex-wrap gap-4 sm:space-x-4 md:space-x-8 text-sm sm:text-base md:text-lg font-medium">
          {["Home", "Cart"].map((item) => (
            <Link
              key={item}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="relative text-white hover:text-yellow-300 transition-all duration-300 hover:scale-105"
            >
              <span className="pb-1 border-b-2 border-transparent hover:border-yellow-300 transition-all duration-300">
                {item}
              </span>
            </Link>
          ))}

          {user?.role === "Admin" && (
            <Link
              to="/admin-dashboard"
              className="relative text-white hover:text-yellow-300 transition-all duration-300 hover:scale-105"
            >
              <span className="pb-1 border-b-2 border-transparent hover:border-yellow-300 transition-all duration-300">
                Admin
              </span>
            </Link>
          )}

          {userLoggedIn && (
            <Link
              to={
                user?.role === "Admin" ? "/admin/orders" : "/user-order-history"
              }
              className="relative text-white hover:text-yellow-300 transition-all duration-300 hover:scale-105"
            >
              <span className="pb-1 border-b-2 border-transparent hover:border-yellow-300 transition-all duration-300">
                {user?.role === "Admin" ? "All Orders" : "My Orders"}
              </span>
            </Link>
          )}

          <Link
            to={userLoggedIn ? "/logout" : "/login"}
            className="relative text-white hover:text-yellow-300 transition-all duration-300 hover:scale-105"
          >
            <span className="pb-1 border-b-2 border-transparent hover:border-yellow-300 transition-all duration-300">
              {userLoggedIn ? "Logout" : "Login"}
            </span>
          </Link>
        </nav>
      </div>
    </motion.header>
  );
}
