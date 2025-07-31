import axios from "axios";
import {
  setLoading,
  setError,
  setOrderItems,
  addOrderItem,
  updateOrderItemInState,
  removeOrderItemFromState,
  setCurrentOrderItem,
} from "./orderItemSlice";

/* Axios instance */
const api = axios.create({
  baseURL: "http://localhost:8000/api/v1/orderitem",
  headers: { "Content-Type": "application/json" },
});

/* ---------- CREATE ---------- */
export const createOrderItem = (orderItem) => async (dispatch) => {
  try {
    // console.log("item: ", orderItem);
    dispatch(setLoading(true));
    const { data } = await api.post("/", orderItem);
    console.log("data: ", data);
    dispatch(addOrderItem(data.data)); // backend returns {data: newOrderItem}
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

/* ---------- READ ALL ---------- */
export const fetchAllOrderItems = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get("/");
    dispatch(setOrderItems(data)); // backend returns array
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

/* ---------- READ ONE ---------- */
export const fetchOrderItemById = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get(`/${id}`);
    dispatch(setCurrentOrderItem(data));
    return data;
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

/* ---------- UPDATE ---------- */
export const updateOrderItem = (orderItem) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.put("/", orderItem); // pass full object
    dispatch(updateOrderItemInState(orderItem)); // optimistic update
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

/* ---------- DELETE ---------- */
export const deleteOrderItem = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await api.delete(`/${id}`);
    dispatch(removeOrderItemFromState(id));
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};
