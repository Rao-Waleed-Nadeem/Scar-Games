import axios from "axios";
import {
  setLoading,
  setError,
  setOrders,
  addOrder,
  updateOrderInState,
  removeOrderFromState,
  setCurrentOrder,
  setOrderHistory,
} from "./orderSlice";

/* Axios instance */
const api = axios.create({
  baseURL: "http://localhost:8000/api/v1/orders",
  headers: { "Content-Type": "application/json" },
});

/* ---------- CREATE ---------- */
export const createOrder = (order) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // console.log("order: ", order);
    const { data } = await api.post("/", order);
    dispatch(addOrder(data.data)); // backend returns {data: newOrder}
    return data;
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

/* ---------- READ ALL ---------- */
export const fetchAllOrders = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get("/");
    console.log("data orders: ", data.data);
    dispatch(setOrders(data.data)); // backend returns array
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const getAllUserOrders = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    console.log("id: ", id);
    const { data } = await api.get(`/user/${id}`);
    console.log("data: ", data);
    dispatch(setOrderHistory(data)); // backend returns array
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

/* ---------- READ ONE ---------- */
export const fetchOrderById = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get(`/${id}`);
    dispatch(setCurrentOrder(data));
    return data;
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

/* ---------- UPDATE ---------- */
export const updateOrder = (order) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.put(`/${order.order_id}`, order); // your controller expects full body
    await dispatch(updateOrderInState(order)); // optimistic; or use data if you return it
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

/* ---------- DELETE ---------- */
export const deleteOrder = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await api.delete(`/${id}`);
    dispatch(removeOrderFromState(id));
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};
