import {
  createPayment,
  getAllPayments,
  getPaymentByOrderId,
  updatePaymentStatus,
  deletePayment,
} from "../models/paymentModel.js";

export const makePayment = async (req, res) => {
  try {
    const { order_id, payment_status, payment_method } = req.body;
    await createPayment({ order_id, payment_status, payment_method });
    res.status(201).json({ message: "Payment recorded successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create payment", details: err.message });
  }
};

export const fetchAllPayments = async (req, res) => {
  try {
    const payments = await getAllPayments();
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};

export const fetchPaymentByOrderId = async (req, res) => {
  try {
    const { order_id } = req.params;
    const payment = await getPaymentByOrderId(order_id);
    res.status(200).json(payment);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch payment" });
  }
};

export const modifyPaymentStatus = async (req, res) => {
  try {
    const { payment_id } = req.params;
    const { payment_status } = req.body;
    await updatePaymentStatus(payment_id, payment_status);
    res.status(200).json({ message: "Payment status updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update payment" });
  }
};

export const removePayment = async (req, res) => {
  try {
    const { payment_id } = req.params;
    await deletePayment(payment_id);
    res.status(200).json({ message: "Payment deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete payment" });
  }
};
