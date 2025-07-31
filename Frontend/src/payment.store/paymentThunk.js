import axios from "axios";
import {
  setLoading,
  setError,
  setPayments,
  addPayment,
  updatePaymentInState,
  removePaymentFromState,
  setCurrentPayment,
} from "./paymentSlice";

/* Axios instance */
const api = axios.create({
  baseURL: "http://localhost:8000/api/v1/payment",
  headers: { "Content-Type": "application/json" },
});

/* ---------- CREATE ---------- */
export const createPayment = (payment) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.post("/", payment);
    dispatch(addPayment(data.data)); // backend returns { data: newPayment }
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

/* ---------- READ ALL ---------- */
export const fetchAllPayments = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get("/");
    dispatch(setPayments(data)); // backend returns array
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

/* ---------- READ ONE ---------- */
export const fetchPaymentById = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.get(`/order/${id}`);
    dispatch(setCurrentPayment(data));
    return data;
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

/* ---------- UPDATE ---------- */
export const updatePayment = (payment) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.put("/", payment); // your controller expects full body
    dispatch(updatePaymentInState(payment)); // optimistic; or use data if you return it
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

/* ---------- DELETE ---------- */
export const deletePayment = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await api.delete(`/${id}`);
    dispatch(removePaymentFromState(id));
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};
