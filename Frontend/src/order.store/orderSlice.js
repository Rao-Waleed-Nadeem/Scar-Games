import { createSlice } from "@reduxjs/toolkit";

/* ---------- initial state ---------- */
const initialState = {
  orders: [], // list of all orders
  currentOrder: null, // single‑order view
  orderHistory: null,
  loading: false,
  error: null,
};

/* ---------- slice ---------- */
const orderSlice = createSlice({
  name: "orders", // ← only ONE name
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setOrders: (state, action) => {
      state.orders = Array.isArray(action.payload) ? action.payload : [];
    },
    setOrderHistory: (state, action) => {
      state.orderHistory = action.payload;
    },
    addOrder: (state, action) => {
      state.orders.push(action.payload);
    },
    updateOrderInState: (state, action) => {
      state.orders = state.orders.map((order) =>
        order.order_id === action.payload.order_id
          ? { ...order, ...action.payload }
          : order
      );
    },

    removeOrderFromState: (state, action) => {
      state.orders = state.orders.filter((o) => o.id !== action.payload);
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  setOrders,
  addOrder,
  setOrderHistory,
  updateOrderInState,
  removeOrderFromState,
  setCurrentOrder,
} = orderSlice.actions;

export default orderSlice.reducer;
