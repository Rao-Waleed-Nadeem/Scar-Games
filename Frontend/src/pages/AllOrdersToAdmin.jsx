import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaBoxOpen } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, getAllUserOrders } from "../order.store/orderThunk";
import { updateOrder } from "../order.store/orderThunk"; // ensure this is exported
import { useNavigate } from "react-router-dom";
import { updateOrderInState } from "../order.store/orderSlice";

export default function AllOrdersToAdmin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userLoggedIn } = useSelector((s) => s.userLoggedIn);
  const { orders } = useSelector((s) => s.orders);
  const { user } = useSelector((s) => s.user);

  const statusOptions = [
    "Processing",
    "Completed",
    "Cancelled",
    "Shipped",
    "Delivered",
  ];

  useEffect(() => {
    if (!userLoggedIn) {
      localStorage.setItem("redirectAfterLogin", "/admin/orders");
      navigate("/login");
    }
  }, [userLoggedIn, navigate]);

  useEffect(() => {
    dispatch(fetchAllOrders()); // For admin: fetch all orders, not just user's
  }, [dispatch]);

  const handleStatusChange = async (e, order) => {
    const newStatus = e.target.value;
    if (newStatus === order.status) return;

    const updatedOrder = {
      ...order,
      status: newStatus,
    };
    // console.log("updation: ", updatedOrder);

    // Immediately update local state optimistically
    await dispatch(updateOrderInState(updatedOrder));
    // await dispatch(fetchAllOrders());
    // Trigger backend update in background
    await dispatch(updateOrder(updatedOrder));
  };

  return (
    <>
      {user && (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-8 text-white">
          <h1 className="text-4xl font-extrabold text-center mb-12 text-[#ffe600] drop-shadow-lg">
            All Orders (Admin)
          </h1>

          {orders?.length ? (
            <div className="space-y-10 mb-5 max-w-6xl mx-auto">
              {orders.map((order, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.6,
                    type: "spring",
                  }}
                  className="bg-white/5 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/10 hover:shadow-blue-500/30 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                    {/* LEFT: Products and Total */}
                    <div className="flex-1 space-y-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-white/80">
                          User Info
                        </h3>
                        <p className="text-white/60 flex gap-2">
                          Username:
                          <p className="text-myLightBlue">
                            {order?.user?.username || "N/A"}
                          </p>
                        </p>
                        <p className="text-white/60 flex gap-2">
                          Email:{" "}
                          <p className="text-myLightBlue">
                            {order?.user?.email || "N/A"}
                          </p>
                        </p>
                      </div>

                      {order.orderItems?.length ? (
                        order.orderItems.map((product) => (
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
                        ))
                      ) : (
                        <p className="text-white/60 italic">
                          No items in this order.
                        </p>
                      )}

                      <div className="border-t border-white/20 pt-4 mt-4">
                        <p className="text-2xl font-bold text-[#00d2ff]">
                          Total: ${order?.total_amount?.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT: Status, Icon, Payment Info */}
                    <div className="flex flex-col items-center gap-6">
                      <FaBoxOpen className="text-6xl text-[#00d2ff] drop-shadow-lg animate-pulse" />

                      {/* Order Status Selector */}
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(e, order)}
                        className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm font-bold uppercase text-white focus:outline-none"
                      >
                        <option className="text-black" value="Processing">
                          Processing
                        </option>
                        <option className="text-black" value="Shipped">
                          Shipped
                        </option>
                        <option className="text-black" value="Delivered">
                          Delivered
                        </option>
                        <option className="text-black" value="Cancelled">
                          Cancelled
                        </option>
                      </select>

                      {/* Payment Info */}
                      {order.payment && (
                        <div className="bg-white/10 p-4 rounded-2xl w-52 text-sm space-y-3 shadow-md">
                          <div className="flex flex-col">
                            <span className="text-white/70">
                              Payment Method:
                            </span>
                            <span className="font-semibold text-[#ffe600] capitalize">
                              {order.payment.Payment_method}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white/70">
                              Payment Status:
                            </span>
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
              <p className="text-xl">No orders available.</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
