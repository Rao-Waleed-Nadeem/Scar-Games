import {
  addInventoryItem,
  getAllInventory,
  getInventoryByGameId,
  updateInventory,
  deleteInventoryItem,
} from "../models/inventoryModel.js";

export const createInventory = async (req, res) => {
  try {
    const { game_id, stock_quantity } = req.body;

    const newInventory = await addInventoryItem({ game_id, stock_quantity });
    res
      .status(201)
      .json({ data: newInventory, message: "Inventory added successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to add inventory", details: err.message });
  }
};

export const fetchAllInventory = async (req, res) => {
  try {
    const inventory = await getAllInventory();
    res.status(200).json(inventory);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
};

export const fetchInventoryByGame = async (req, res) => {
  try {
    const { game_id } = req.params;
    const item = await getInventoryByGameId(game_id);

    if (!item) {
      return res.status(404).json({ error: "Inventory item not found" });
    }

    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch inventory item" });
  }
};

export const modifyInventory = async (req, res) => {
  try {
    const { game_id } = req.params;
    const { stock_quantity } = req.body;

    await updateInventory(game_id, stock_quantity);
    res.status(200).json({ message: "Inventory updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update inventory" });
  }
};

export const removeInventoryItem = async (req, res) => {
  try {
    const { game_id } = req.params;

    await deleteInventoryItem(game_id);
    res.status(200).json({ message: "Inventory item deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete inventory" });
  }
};
