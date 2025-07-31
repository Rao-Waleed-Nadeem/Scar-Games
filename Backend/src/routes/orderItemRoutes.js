import express from "express";
import {
  createOrderItem,
  fetchAllOrderItems,
  fetchItemsByOrderId,
  modifyOrderItem,
  removeOrderItem,
} from "../controllers/orderItemController.js";

const router = express.Router();

router.post("/", createOrderItem);
router.get("/", fetchAllOrderItems);
router.get("/order/:order_id", fetchItemsByOrderId);
router.put("/:order_item_id", modifyOrderItem);
router.delete("/:order_item_id", removeOrderItem);

export default router;
