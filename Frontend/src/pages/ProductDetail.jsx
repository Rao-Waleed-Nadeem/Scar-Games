// src/pages/ProductDetail.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { addGameToCart, updateCartQuantity } from "../cart.store/cartThunk"; // adjust path if needed

import { fetchGameById } from "../game.store/gameThunk"; // ← your thunk
import { fetchInventoryItemById } from "../inventory.store/inventoryThunk";

/* ---------- styles ---------- */
const bgGradient =
  "bg-gradient-to-br from-myDarkPurple via-myPurple to-myLightBlue";
const labelStyle = "text-myLightBlue font-semibold uppercase tracking-wide";
const fadeVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { carts } = useSelector((s) => s.carts); // ← cart slice
  const { currentInventory } = useSelector((s) => s.currentInventory);
  const [cart, setCart] = useState(currentInventory);
  const navigate = useNavigate();
  const handleAddToCart = () => {
    const existing = carts?.find((c) => c.game_id === currentGame.game_id);
    if (existing) {
      dispatch(
        updateCartQuantity({
          game_id: existing?.game_id,
          quantity: existing?.quantity + 1,
        })
      );
      // console.log("carts: ", carts);
    } else {
      dispatch(
        addGameToCart({
          game_id: currentGame.game_id, // make sure backend sends this id
          quantity: 1,
        })
      );
    }
    navigate("/cart");
  };

  // Redux state
  const { currentGame, loading, error } = useSelector((s) => s.currentGame);
  // console.log("currentInventory: ", currentInventory);
  // console.log("error: ", error);

  useEffect(() => {
    if (id) {
      dispatch(fetchGameById(id));
      dispatch(fetchInventoryItemById(id));
    }
  }, [id, dispatch]);
  /* ---------- UI ---------- */
  if (loading)
    return (
      <div
        className={`min-h-screen ${bgGradient} flex items-center justify-center`}
      >
        <p className="text-white text-xl">Loading…</p>
      </div>
    );

  if (error && !currentGame)
    return (
      <div
        className={`min-h-screen ${bgGradient} flex items-center justify-center`}
      >
        <p className="text-red-400 text-xl">Error: {error}</p>
      </div>
    );

  if (!currentGame)
    return (
      <div
        className={`min-h-screen ${bgGradient} flex items-center justify-center`}
      >
        <p className="text-white text-xl">Game not found.</p>
      </div>
    );

  return (
    <div
      className={`min-h-screen ${bgGradient} py-12 px-6 flex flex-col justify-center items-center`}
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center text-5xl font-extrabold text-white mb-12 drop-shadow-lg tracking-tight"
      >
        Product Details
      </motion.h2>

      <motion.div
        variants={fadeVariant}
        initial="hidden"
        animate="visible"
        className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 w-full max-w-5xl grid md:grid-cols-2 gap-10"
      >
        <motion.img
          src="https://cdn.cloudflare.steamstatic.com/steam/apps/1677740/header.jpg"
          alt={currentGame.title}
          className="rounded-2xl w-full object-cover shadow-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        />

        <div className="flex flex-col justify-center">
          <h2 className="text-4xl font-extrabold text-muPink mb-4 drop-shadow-lg">
            {currentGame.title}
          </h2>

          <p className="text-white text-lg mb-6 max-w-prose leading-relaxed">
            {currentGame.description}
          </p>

          <div className="space-y-2 text-white text-sm sm:text-base">
            <p>
              <span className={labelStyle}>Platform:</span>{" "}
              {currentGame.platform}
            </p>
            <p>
              <span className={labelStyle}>Genre:</span> {currentGame.genre}
            </p>
            <p>
              <span className={labelStyle}>Price:</span>{" "}
              <span className="text-pink-400 font-semibold">
                ${currentGame.price}
              </span>
            </p>
          </div>

          <motion.button
            disabled={currentInventory?.stock_quantity <= 0}
            className={`mt-8 bg-muPink ${
              currentInventory?.stock_quantity > 0
                ? "cursor-pointer hover:bg-pink-600"
                : "opacity-50 cursor-not-allowed"
            } text-white py-3 px-6 rounded-xl text-lg font-semibold transition-colors shadow-xl`}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            whileHover={{
              scale: currentInventory?.stock_quantity > 0 ? 1.02 : 1,
            }}
          >
            {currentInventory?.stock_quantity > 0
              ? "ADD TO CART"
              : "OUT OF STOCK 🚫"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
