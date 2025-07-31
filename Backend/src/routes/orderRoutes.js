import express from "express";
import {
  createNewOrder,
  fetchAllOrders,
  fetchOrderById,
  getALLUserOrders,
  modifyOrder,
  removeOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createNewOrder);
router.get("/", fetchAllOrders);
router.get("/user/:id", getALLUserOrders);
router.get("/:id", fetchOrderById);
router.put("/:id", modifyOrder);
router.delete("/:id", removeOrder);

export default router;
