import express from "express";
import {
  createInventory,
  fetchAllInventory,
  fetchInventoryByGame,
  modifyInventory,
  removeInventoryItem,
} from "../controllers/inventoryController.js";

const router = express.Router();

router.post("/", createInventory);
router.get("/", fetchAllInventory);
router.get("/:game_id", fetchInventoryByGame);
router.put("/:game_id", modifyInventory);
router.delete("/:game_id", removeInventoryItem);

export default router;
