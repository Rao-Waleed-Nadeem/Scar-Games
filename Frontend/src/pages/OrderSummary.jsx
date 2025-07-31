import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaTrashAlt, FaMinus, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchGameById } from "../game.store/gameThunk";
import {
  clearAll,
  deleteCartItem,
  fetchCart,
  updateCartQuantity,
} from "../cart.store/cartThunk";
import { createOrder } from "../order.store/orderThunk";
import { createOrderItem } from "../orderItem.store/orderItemThunk";

const mockOrder = [
  {
    id: 1,
    name: "PlayStation 5 Console",
    quantity: 1,
    price: 499.99,
    image: "https://i.imgur.com/Hh6zHDc.png",
  },
  {
    id: 2,
    name: "VR Headset",
    quantity: 2,
    price: 199.99,
    image: "https://i.imgur.com/BWYzNQ0.png",
  },
];

export default function OrderSummary() {
  const navigate = useNavigate();
  const [newCarts, setNewCarts] = useState([]);
  const dispatch = useDispatch();
  const [items, setItems] = useState(mockOrder);
  const { carts } = useSelector((s) => s.carts);
  const { user } = useSelector((s) => s.user);
  const { userLoggedIn } = useSelector((s) => s.userLoggedIn);
  // console.log("carts: ", carts);

  useEffect(() => {
    // Redirect to login page if not logged in
    if (!userLoggedIn) {
      localStorage.setItem("redirectAfterLogin", "/order-summary");
      navigate("/login");
    }
  }, [userLoggedIn, navigate]);

  useEffect(() => dispatch(fetchCart()), []);

  useEffect(() => {
    const loadGames = async () => {
      const results = [];
      for (const cartItem of carts) {
        const game = await dispatch(fetchGameById(cartItem.game_id));
        // console.log("game: ", game);
        results.push({ ...game, quantity: cartItem.quantity });
      }
      setNewCarts(results);
    };

    if (carts.length > 0) loadGames();
  }, [carts]);

  // console.log("newCarts: ", newCarts);

  const handleDelete = (id) => {
    // console.log("deleting");
    setNewCarts(newCarts.filter((item) => item.game_id !== id));
    dispatch(deleteCartItem(id));
  };

  // console.log("carts: ", carts);

  const total = newCarts
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  const handleQuantityChange = async (id, delta) => {
    const updatedCarts = newCarts.map((item) => {
      if (item.game_id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);

        // Dispatch the update to Redux (backend)
        dispatch(
          updateCartQuantity({ game_id: item.game_id, quantity: newQuantity })
        );

        // Update the local state with the new quantity
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    // Update the state with the modified cart
    // console.log("update");

    setNewCarts(updatedCarts);
    // dispatch(fetchCart());
  };

  const handleConfirmOrder = async () => {
    const order = {
      total_amount: total,
      user_id: user?.user_id,
      status: "Processing",
    };
    const data = await dispatch(createOrder(order));
    console.log("order: ", data.data[0]);
    console.log("newCarts: ", newCarts);
    newCarts.map(async (cart) => {
      await dispatch(
        createOrderItem({
          order_id: data.data[0].order_id,
          game_id: cart.game_id,
          quantity: cart.quantity,
        })
      );
    });
    setNewCarts([]);
    dispatch(clearAll());
    // console.log("order_id: ", data.data[0].order_id);
    navigate(`/payment/${data.data[0].order_id}`, { replace: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-myDarkPurple to-[#2c176d] p-6 text-white"
    >
      <div className="max-w-5xl mx-auto space-y-12 py-10 px-4">
        <motion.h2
          className="text-5xl py-2 font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 drop-shadow-xl"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          🛍️ Order Summary
        </motion.h2>

        <div className="space-y-8">
          {newCarts.map((item, idx) => (
            <motion.div
              key={item.game_id}
              className="flex items-center justify-between bg-white/5 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/10 hover:shadow-pink-500/30 transition-all duration-300"
              whileHover={{ scale: 1.015 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex items-start gap-6">
                <img
                  src="https://cdn.cloudflare.steamstatic.com/steam/apps/1677740/header.jpg"
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-2xl shadow-md"
                />
                <div className="space-y-2">
                  {/* Title at the start */}
                  <h3 className="text-xl font-extrabold text-yellow-400">
                    {item.title}
                  </h3>

                  {/* Price and Quantity */}
                  <p className="text-white/70">
                    Price: ${item?.price?.toFixed(2)}
                  </p>
                  <p className="text-white/70">Quantity: {item.quantity}</p>

                  {/* Quantity Buttons */}
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => handleQuantityChange(item.game_id, -1)}
                      className="bg-pink-500/20 cursor-pointer hover:bg-pink-500/30 p-2 rounded-full transition-all"
                    >
                      <FaMinus className="text-white" />
                    </button>
                    <span className="text-lg font-semibold text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.game_id, 1)}
                      className="cursor-pointer bg-pink-500/20 hover:bg-pink-500/30 p-2 rounded-full transition-all"
                    >
                      <FaPlus className="text-white" />
                    </button>
                  </div>

                  {/* Total Price */}
                  <p className="text-pink-400 font-semibold mt-2">
                    Total: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Delete Button */}
              <motion.button
                whileHover={{ rotate: 30, scale: 1.2 }}
                className="cursor-pointer text-red-400 hover:text-red-600 transition-all duration-150 text-2xl"
                onClick={() => handleDelete(item.game_id)}
              >
                <FaTrashAlt />
              </motion.button>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-3xl font-extrabold text-right text-green-400 drop-shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Grand Total: ${total}
        </motion.div>

        {total > 0 && (
          <motion.button
            className="w-full py-4 cursor-pointer rounded-2xl text-xl font-bold bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 text-black shadow-2xl hover:shadow-yellow-500/40 hover:scale-105 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            onClick={handleConfirmOrder}
          >
            🔥 Confirm Order
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
