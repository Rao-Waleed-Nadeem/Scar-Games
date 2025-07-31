import {
  addOrderItem,
  getAllOrderItems,
  getOrderItemsByOrderId,
  updateOrderItem,
  deleteOrderItem,
} from "../models/orderItemModel.js";

export const createOrderItem = async (req, res) => {
  try {
    const { order_id, game_id, quantity } = req.body;
    const order_item = await addOrderItem({ order_id, game_id, quantity });
    console.log("order_item: ", order_item);
    res
      .status(201)
      .json({ data: order_item, message: "Order item added successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create order item", details: err.message });
  }
};

export const fetchAllOrderItems = async (req, res) => {
  try {
    const items = await getAllOrderItems();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch order items" });
  }
};

export const fetchItemsByOrderId = async (req, res) => {
  try {
    const { order_id } = req.params;
    const items = await getOrderItemsByOrderId(order_id);
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch order items" });
  }
};

export const modifyOrderItem = async (req, res) => {
  try {
    const { order_item_id } = req.params;
    const { quantity } = req.body;
    await updateOrderItem(order_item_id, quantity);
    res.status(200).json({ message: "Order item updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update order item" });
  }
};

export const removeOrderItem = async (req, res) => {
  try {
    const { order_item_id } = req.params;
    await deleteOrderItem(order_item_id);
    res.status(200).json({ message: "Order item deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete order item" });
  }
};
