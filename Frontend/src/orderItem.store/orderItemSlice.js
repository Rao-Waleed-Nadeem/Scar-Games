import { createSlice } from "@reduxjs/toolkit";

/* ---------- initial state ---------- */
const initialState = {
  orderItems: [], // list of all order items
  currentOrderItem: null, // single‑order item view
  loading: false,
  error: null,
};

/* ---------- slice ---------- */
const orderItemSlice = createSlice({
  name: "orderItems",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setOrderItems: (state, action) => {
      state.orderItems = action.payload;
    },
    addOrderItem: (state, action) => {
      state.orderItems.push(action.payload);
    },
    updateOrderItemInState: (state, action) => {
      const idx = state.orderItems.findIndex(
        (item) => item.order_item_id === action.payload.order_item_id
      );
      if (idx !== -1) state.orderItems[idx] = action.payload;
    },
    removeOrderItemFromState: (state, action) => {
      state.orderItems = state.orderItems.filter(
        (item) => item.id !== action.payload
      );
    },
    setCurrentOrderItem: (state, action) => {
      state.currentOrderItem = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  setOrderItems,
  addOrderItem,
  updateOrderItemInState,
  removeOrderItemFromState,
  setCurrentOrderItem,
} = orderItemSlice.actions;

export default orderItemSlice.reducer;
