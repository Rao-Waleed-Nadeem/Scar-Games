import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaCcVisa,
  FaPaypal,
  FaMoneyBillAlt,
  FaCreditCard,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createPayment, fetchPaymentById } from "../payment.store/paymentThunk";

const paymentOptions = [
  { id: "CreditCard", label: "Credit Card", icon: <FaCcVisa /> },
  { id: "DebitCard", label: "Debit Card", icon: <FaCreditCard /> },
  { id: "Paypal", label: "PayPal", icon: <FaPaypal /> },
  { id: "CashOnDelivery", label: "Cash on Delivery", icon: <FaMoneyBillAlt /> },
];

const Payment = () => {
  const { order_id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [selected, setSelected] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const { userLoggedIn } = useSelector((s) => s.userLoggedIn);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Redirect to login page if not logged in
    if (!userLoggedIn) {
      localStorage.setItem("redirectAfterLogin", "/payment");
      navigate("/login");
    }
  }, [userLoggedIn, navigate]);

  const inputClass = (error) =>
    `bg-white/10 border rounded-xl px-4 py-3 w-full text-white placeholder-white/50 focus:outline-none transition duration-200 ${
      error
        ? "border-red-500 focus:ring-2 focus:ring-red-500"
        : "border-white/20 focus:ring-2 focus:ring-pink-400"
    }`;

  const validate = () => {
    const newErrors = {};

    const cardNumberRegex = /^\d{16}$/; // 16-digit number
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/YY
    const cvvRegex = /^\d{3,4}$/; // 3 or 4 digits
    const nameRegex = /^[A-Za-z\s]+$/; // Only letters and spaces
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email check

    if (selected === "CreditCard" || selected === "DebitCard") {
      if (!cardNumber || !cardNumberRegex.test(cardNumber)) {
        newErrors.cardNumber = true;
      }
      if (!expiry || !expiryRegex.test(expiry)) {
        newErrors.expiry = true;
      }
      if (!cvv || !cvvRegex.test(cvv)) {
        newErrors.cvv = true;
      }
      if (!cardName.trim() || !nameRegex.test(cardName.trim())) {
        newErrors.cardName = true;
      }
    } else if (selected === "Paypal") {
      if (!paypalEmail.trim() || !emailRegex.test(paypalEmail)) {
        newErrors.paypalEmail = true;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = async () => {
    if (validate()) {
      await dispatch(
        createPayment({
          order_id: order_id,
          payment_method: selected,
          payment_status:
            selected === "CashOnDelivery" ? "Pending" : "Completed",
        })
      );
      setOrderConfirmed(true);
    } else return;
  };

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!order_id) return;

      // Call your backend or Redux thunk to fetch order info
      const orderData = await dispatch(fetchPaymentById(order_id));
      // console.log("orderData: ", orderData);
      if (orderData[0]?.payment_status === "Completed") {
        setOrderConfirmed(true); // Already paid, show Thank You page
      }
    };

    checkPaymentStatus();
  }, [order_id, dispatch]);

  //   console.log("selected: ", selected);
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-[#1f1147] to-[#2b1d52] p-10 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {!orderConfirmed ? (
        <div className="max-w-3xl mx-auto space-y-10">
          <motion.h2
            className="text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Choose Your Payment Method
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {paymentOptions.map((option) => (
              <motion.div
                key={option.id}
                className={`cursor-pointer rounded-2xl p-6 flex items-center justify-between border-2 transition-all duration-300 shadow-lg ${
                  selected === option.id
                    ? "border-pink-500 bg-white/10 shadow-pink-500/30"
                    : "border-white/10 bg-white/5 hover:border-pink-400 hover:bg-white/10"
                }`}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  setSelected(option.id);
                  setErrors({});
                }}
              >
                <div className="text-xl font-bold text-yellow-300">
                  {option.label}
                </div>
                <div className="text-3xl text-pink-400">{option.icon}</div>
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {selected && (
              <motion.div
                key={selected}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-white/5 p-8 rounded-3xl border border-white/10 shadow-inner space-y-6"
              >
                {(selected === "CreditCard" || selected === "DebitCard") && (
                  <>
                    <input
                      type="text"
                      placeholder="Card Number"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className={inputClass(errors.cardNumber)}
                    />
                    <div className="flex gap-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className={inputClass(errors.expiry)}
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className={inputClass(errors.cvv)}
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Cardholder Name"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className={inputClass(errors.cardName)}
                    />
                  </>
                )}

                {selected === "Paypal" && (
                  <input
                    type="email"
                    placeholder="PayPal Email"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    className={inputClass(errors.paypalEmail)}
                  />
                )}

                {selected === "CashOnDelivery" && (
                  <p className="text-yellow-200 text-lg">
                    You’ll pay in cash when your order is delivered. Please
                    ensure someone is available to receive it.
                  </p>
                )}

                <motion.button
                  className="w-full cursor-pointer py-3 text-lg font-bold bg-gradient-to-r from-yellow-400 to-pink-500 rounded-xl text-black shadow-xl hover:scale-105 transition-transform duration-300"
                  whileHover={{ scale: 1.05 }}
                  onClick={handleConfirm}
                >
                  Confirm Payment
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-6"
        >
          <motion.h2
            className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Thank You for Your Order!
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-white/80"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Your epic journey begins now. 🎮 We hope you enjoy every moment.
          </motion.p>

          <motion.div
            className="flex justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.6,
              type: "spring",
              stiffness: 150,
              damping: 10,
            }}
          >
            <img
              src="https://clipartmag.com/images/animated-thank-you-28.gif"
              alt="Thank You Celebration"
              className="w-48 h-48 rounded-full shadow-2xl border-4 border-yellow-300/30 object-cover"
            />
          </motion.div>

          <motion.p
            className="text-pink-300 mt-6 text-sm italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            You’ll receive a confirmation email shortly.
          </motion.p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Payment;
