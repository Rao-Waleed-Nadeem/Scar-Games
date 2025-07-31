import {
  insertGame,
  deleteGame,
  updateGame,
  getAllGames,
  getGameById,
} from "../models/gameModel.js";

export const createGame = async (req, res) => {
  try {
    const { title, description, price, platform, genre } = req.body;
    const newGame = await insertGame({
      title,
      description,
      price,
      platform,
      genre,
    });
    // console.log("newGame is", newGame);

    res.status(201).json({
      data: newGame, // send the complete game object
      message: "Game created successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeGame = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteGame(id);
    res.status(200).json({ message: "Game deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const modifyGame = async (req, res) => {
  try {
    const { game_id, title, description, price, platform, genre } = req.body;
    await updateGame({ game_id, title, description, price, platform, genre });
    res.status(200).json({ message: "Game updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchAllGames = async (req, res) => {
  try {
    const games = await getAllGames();
    res.status(200).json(games);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchGameById = async (req, res) => {
  try {
    const { id } = req.params;
    const game = await getGameById(id);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    res.status(200).json(game);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
