import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getUserOrders,
} from "../models/orderModel.js";

export const createNewOrder = async (req, res) => {
  try {
    const { user_id, total_amount, status } = req.body;
    const order_date = new Date();

    // Get the order_id after inserting the new order
    const order = await createOrder({
      user_id,
      order_date,
      total_amount,
      status,
    });
    // console.log("order: ", order);
    res.status(201).json({
      message: "Order created successfully",
      data: order, // Include the order ID in the response
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to create order",
      data: err.message,
    });
  }
};

export const fetchOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await getOrderById(id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

export const modifyOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, total_amount } = req.body;
    // console.log("id", id);
    // console.log("status, amount ", status, total_amount);
    const updatedOrder = {
      order_id: id,
      status,
      total_amount,
    };
    await updateOrder(updatedOrder);
    res.status(200).json({ message: "Order updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update order" });
  }
};

export const removeOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteOrder(id);
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete order" });
  }
};

export const getALLUserOrders = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log("id: ", id);
    const orders = await getUserOrders(id);
    // console.log("orders: ", orders);
    res
      .status(200)
      .json({ data: orders, message: "Users orders fetched successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user order" });
  }
};

export const fetchAllOrders = async (req, res) => {
  try {
    const orders = await getAllOrders();
    res
      .status(200)
      .json({ data: orders, message: "All orders fetched successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};
