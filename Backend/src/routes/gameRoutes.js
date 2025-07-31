import express from "express";
import {
  createGame,
  removeGame,
  modifyGame,
  fetchAllGames,
  fetchGameById,
} from "../controllers/gameController.js";

const router = express.Router();

router.get("/", fetchAllGames);
router.get("/:id", fetchGameById);
router.post("/", createGame);
router.put("/", modifyGame); // expects full game object with game_id
router.delete("/:id", removeGame);

export default router;
