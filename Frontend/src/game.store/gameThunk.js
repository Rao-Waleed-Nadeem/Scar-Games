import axios from "axios";
import {
  setLoading,
  setError,
  setGames,
  addGame,
  updateGameInState,
  removeGameFromState,
  setCurrentGame,
} from "./gameSlice";

/* Axios instance */
const api = axios.create({
  baseURL: "http://localhost:8000/api/v1/games",
  headers: { "Content-Type": "application/json" },
});

/* ---------- CREATE ---------- */
export const createGame = (game) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.post("/", game);
    dispatch(addGame(data.data)); // backend returns {data: newGame}
    return data;
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

/* ---------- READ ALL ---------- */
export const fetchAllGames = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get("/");
    dispatch(setGames(data)); // backend returns array
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

/* ---------- READ ONE ---------- */
export const fetchGameById = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get(`/${id}`);
    // console.log("data: ", data);
    dispatch(setCurrentGame(data));
    dispatch(setError(""));
    return data;
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

/* ---------- UPDATE ---------- */
export const updateGame = (game) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.put("/", game); // your controller expects full body
    dispatch(updateGameInState(game)); // optimistic; or use data if you return it
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

/* ---------- DELETE ---------- */
export const deleteGame = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await api.delete(`/${id}`);
    dispatch(removeGameFromState(id));
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};
