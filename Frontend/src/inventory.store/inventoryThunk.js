import axios from "axios";
import {
  setLoading,
  setError,
  setInventories,
  addInventory,
  updateInventoryInState,
  setCurrentInventory,
  removeInventoryFromState,
} from "./inventorySlice";

/* Axios instance */
const api = axios.create({
  baseURL: "http://localhost:8000/api/v1/inventory",
  headers: { "Content-Type": "application/json" },
});

/* ---------- CREATE ---------- */
export const createInventoryItem = (item) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.post("/", item);
    dispatch(addInventory(data.data)); // backend returns {data: newItem}
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

/* ---------- READ ALL ---------- */
export const fetchAllInventoryItems = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get("/");
    dispatch(setInventories(data)); // backend returns array
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

/* ---------- READ ONE ---------- */
export const fetchInventoryItemById = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get(`/${id}`);
    await dispatch(setCurrentInventory(data));
    await dispatch(setError(""));
    // console.log("data: ", data);
    return data;
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

/* ---------- UPDATE ---------- */
export const updateInventoryItem = (item) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { game_id, stock_quantity } = item;
    await api.put(`/${game_id}`, { stock_quantity }); // 👈 correct URL and body
    dispatch(updateInventoryInState(item)); // updating local state
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

/* ---------- DELETE ---------- */
export const deleteInventoryItem = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await api.delete(`/${id}`);
    dispatch(removeInventoryFromState(id));
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};
