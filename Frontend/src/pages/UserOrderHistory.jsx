import { motion } from "framer-motion";
import { useEffect } from "react";
import { FaBoxOpen } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getAllUserOrders } from "../order.store/orderThunk";
import { useNavigate } from "react-router-dom";

export default function UserOrderHistory() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.user);
  const { orderHistory } = useSelector((s) => s.orderHistory);
  const { userLoggedIn } = useSelector((s) => s.userLoggedIn);
  useEffect(() => {
    // Redirect to login page if not logged in
    if (!userLoggedIn) {
      localStorage.setItem("redirectAfterLogin", "/payment");
      navigate("/login");
    }
  }, [userLoggedIn, navigate]);

  useEffect(() => {
    if (user) dispatch(getAllUserOrders(user?.user_id));
  }, [dispatch, user?.user_id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-8 text-white">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-[#ffe600] drop-shadow-lg">
        Your Order History
      </h1>

      {orderHistory?.data?.length ? (
        <div className="space-y-10 mb-5 max-w-5xl mx-auto">
          {orderHistory?.data?.map((order, index) => (
            <motion.div
              key={order.order_id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6, type: "spring" }}
              className="bg-white/5 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/10 hover:shadow-blue-500/30 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                {/* Left Side: Items + Total */}
                <div className="flex-1 space-y-6">
                  {order.orderItems?.map((product) => (
                    <div
                      key={product.order_item_id}
                      className="flex items-center gap-5"
                    >
                      <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center text-lg font-bold text-white/70 shadow-md border border-white/10">
                        <img
                          className="object-cover h-full w-auto rounded-2xl"
                          src="https://cdn.cloudflare.steamstatic.com/steam/apps/1677740/header.jpg"
                          alt=""
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-yellow-300">
                          {product.title}
                        </h3>
                        <p className="text-white/70">
                          Price: ${product.price.toFixed(2)}
                        </p>
                        <p className="text-white/70">
                          Quantity: {product.quantity}
                        </p>
                        <p className="text-white/70">
                          Platform: {product.platform}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Total Price immediately below products */}
                  <div className="border-t border-white/20 pt-4 mt-4">
                    <p className="text-2xl font-bold text-[#00d2ff]">
                      Total: ${order.total_amount.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Right Side: Status, Payment, and Ship Icon */}
                <div className="flex flex-col items-center gap-6">
                  {/* Shipping Icon */}
                  <FaBoxOpen className="text-6xl text-[#00d2ff] drop-shadow-lg animate-pulse" />

                  {/* Order Status */}
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className={`text-sm font-semibold uppercase rounded-full px-5 py-2 shadow-md ${
                      order.status === "Processing"
                        ? "bg-yellow-400/20 text-yellow-300"
                        : order.status === "Shipped"
                        ? "bg-blue-400/20 text-blue-300"
                        : order.status === "Delivered"
                        ? "bg-green-400/20 text-green-300"
                        : "bg-red-400/20 text-red-300"
                    }`}
                  >
                    {order.status}
                  </motion.div>

                  {/* Payment Info */}
                  {order.payment && (
                    <div className="bg-white/10 p-4 rounded-2xl w-52 text-sm space-y-3 shadow-md">
                      <div className="flex flex-col">
                        <span className="text-white/70">Payment Method:</span>
                        <span className="font-semibold text-[#ffe600] capitalize">
                          {order.payment.Payment_method}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white/70">Payment Status:</span>
                        <span
                          className={`font-semibold ${
                            order.payment.payment_status === "Completed"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {order.payment.payment_status}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-80 text-white/70">
          <FaBoxOpen className="text-6xl text-[#00d2ff] animate-bounce mb-4" />
          <p className="text-xl">You have no orders yet.</p>
        </div>
      )}
    </div>
  );
}
