// CartPage.jsx
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { FaTrashAlt, FaMinus, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCartItem,
  fetchCart,
  updateCartQuantity,
} from "../cart.store/cartThunk";
import { fetchGameById } from "../game.store/gameThunk";
import { useNavigate } from "react-router-dom";
import { fetchAllInventoryItems } from "../inventory.store/inventoryThunk";

const bgGradient =
  "bg-gradient-to-br from-myDarkPurple via-myPurple to-myLightBlue";
const textStyle = "text-white";
const cardStyle =
  "bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300";

export default function CartPage() {
  const navigate = useNavigate();
  const [newCarts, setNewCarts] = useState([]);
  const { carts } = useSelector((s) => s.carts);
  const [filteredCarts, setFilteredCarts] = useState(carts);
  const { inventories } = useSelector((s) => s.inventories);
  const [newInventories, setNewInventories] = useState();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCart());
    dispatch(fetchAllInventoryItems());
  }, [dispatch]);

  useEffect(() => {
    if (inventories) {
      const filteredGameIds = inventories
        .filter((inv) => inv.stock_quantity > 0)
        .map((inv) => inv.game_id);

      setNewInventories(filteredGameIds);
    }
  }, [inventories]);

  useEffect(() => {
    if (newInventories?.length > 0 && carts?.length > 0) {
      setFilteredCarts(
        carts.filter((cart) => newInventories.includes(cart.game_id))
      );
    }
  }, [newInventories, carts]);

  // console.log("carts: ", carts);
  useEffect(() => {
    const loadGames = async () => {
      const results = [];
      for (const cartItem of carts) {
        const game = await dispatch(fetchGameById(cartItem.game_id));
        const inventoryItem = inventories.find(
          (inv) => inv.game_id === cartItem.game_id
        );

        const stock_quantity = inventoryItem?.stock_quantity || 0;

        results.push({
          ...game,
          quantity: cartItem.quantity,
          stock_quantity,
          game_id: cartItem.game_id,
        });
      }
      setNewCarts(results);
    };

    if (carts?.length > 0 && inventories?.length > 0) loadGames();
  }, [carts, inventories]);

  // console.log("newCarts: ", newCarts);

  const totalAmount = useMemo(
    () => newCarts.reduce((acc, item) => acc + item?.price * item.quantity, 0),
    [newCarts]
  );

  const handleQuantityChange = async (id, delta) => {
    const updatedCarts = newCarts.map((item) => {
      if (item.game_id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);

        if (newQuantity > item.stock_quantity) return item;

        dispatch(updateCartQuantity({ game_id: id, quantity: newQuantity }));
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setNewCarts(updatedCarts);
  };

  const handleDelete = (id) => {
    // console.log("deleting");
    setNewCarts(newCarts.filter((item) => item.game_id !== id));
    dispatch(deleteCartItem(id));
  };

  return (
    <div className={`min-h-screen ${bgGradient} px-4 py-12`}>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center text-5xl font-extrabold text-white mb-12 drop-shadow-lg tracking-tight"
      >
        Your Cart
      </motion.h2>

      <div className="grid gap-8 max-w-6xl mx-auto">
        {newCarts?.map((product, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 + index * 0.1, ease: "easeOut" }}
            className={`${cardStyle} flex flex-col md:flex-row items-center gap-6`}
          >
            <img
              src="https://cdn.cloudflare.steamstatic.com/steam/apps/1677740/header.jpg"
              alt={product.title}
              className="w-full max-w-xs rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
            />

            <div className="flex-1 text-white space-y-2">
              <h3 className="text-3xl font-bold text-muPink">
                {product.title}
              </h3>
              <p className="text-white/90 text-sm sm:text-base max-w-xl">
                {product.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-sm sm:text-base">
                <div>
                  <span className="font-semibold text-myLightBlue">
                    Unit Price:
                  </span>
                  <span className="ml-2 text-white">
                    ${product?.price?.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(product.game_id, -1)}
                    className="bg-purple-500/20 cursor-pointer hover:bg-purple-500/30 p-2 rounded-full transition-all"
                  >
                    <FaMinus className="text-white" />
                  </button>
                  <span className="text-white">{product.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(product.game_id, 1)}
                    disabled={product.quantity >= product.stock_quantity}
                    className={`bg-purple-500/20 disabled:cursor-not-allowed cursor-pointer hover:bg-purple-500/30 p-2 rounded-full transition-all ${
                      product.quantity >= product.stock_quantity
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <FaPlus className="text-white" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-myLightBlue">
                      Total:
                    </span>
                    <span className="ml-2 text-pink-400 font-bold">
                      ${(product.price * product.quantity).toFixed(2)}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ rotate: 30, scale: 1.2 }}
                    onClick={() => handleDelete(product.game_id)}
                    className="cursor-pointer text-red-400 hover:text-red-600 transition-all duration-150 text-2xl"
                  >
                    <FaTrashAlt />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-12 max-w-4xl mx-auto bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-lg space-y-6"
      >
        <h3 className="text-white text-2xl font-semibold mb-4">
          Order Summary
        </h3>

        <div className="flex justify-between text-lg text-white">
          <span>Total Amount</span>
          <span className="text-pink-400 font-bold text-2xl">
            ${totalAmount.toFixed(2)}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => navigate("/")}
            className="cursor-pointer py-4 bg-gradient-to-r from-blue-400 w-48 via-blue-600 to-blue-700 text-white text-lg font-medium rounded-full shadow-lg hover:shadow-blue-500/60 transition-all duration-500 backdrop-blur-md"
          >
            Add More
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => navigate("/order-summary")}
            disabled={!newCarts.length}
            className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto md:px-10 w-48 py-4 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-blue-400/60 transition-all duration-500 tracking-wide backdrop-blur-md"
          >
            Confirm Order
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
