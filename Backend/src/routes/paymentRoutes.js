import express from "express";
import {
  makePayment,
  fetchAllPayments,
  fetchPaymentByOrderId,
  modifyPaymentStatus,
  removePayment,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/", makePayment);
router.get("/", fetchAllPayments);
router.get("/order/:order_id", fetchPaymentByOrderId);
router.put("/:payment_id", modifyPaymentStatus);
router.delete("/:payment_id", removePayment);

export default router;
