// src/store/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

/* ---------- initial state ---------- */
const initialState = {
  carts: [], // [{ game_id, quantity, title, price, ... }]
  cart: null, // optional single‑item detail
  loading: false, // used only for UI spinners
  error: null, // used only for UI messages
};

/* ---------- slice ---------- */
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /* status */
    setLoading: (state, { payload }) => {
      state.loading = payload;
    },
    setError: (state, { payload }) => {
      state.error = payload;
    },

    /* bulk replace (during app init) */
    setCarts: (state, { payload }) => {
      state.carts = payload;
    },

    /* add or merge item */
    addToCart: (state, { payload }) => {
      const existing = state.carts.find((c) => c.game_id === payload.game_id);
      if (existing) {
        existing.quantity += payload.quantity;
      } else {
        state.carts.push(payload);
      }
    },

    /* update specific quantity */
    updateCartItem: (state, { payload }) => {
      const itemIndex = state.carts.findIndex(
        (c) => c.game_id === payload.game_id
      );

      if (itemIndex !== -1) {
        // Update the quantity of the found item
        state.carts[itemIndex].quantity = payload.quantity;

        // Save the updated carts to local storage immediately
        localStorage.setItem("carts", JSON.stringify(state.carts));

        // Optionally, you can dispatch setCarts to ensure the Redux store is updated (this step is redundant in most cases)
        // Dispatch the setCarts action with the updated carts
        // setCarts(state.carts);  // this would dispatch the setCarts action
      }
    },

    /* remove item */
    removeCartItem: (state, { payload }) => {
      state.carts = state.carts.filter((c) => c.game_id !== payload);
      localStorage.setItem("carts", JSON.stringify(state.carts));
    },

    /* single‑item view (optional) */
    setCurrentCartItem: (state, { payload }) => {
      state.cart = payload; // null or { game_id, quantity, ... }
    },

    clearAllCart: (state) => {
      state.carts = [];
    },
  },
});

/* ---------- exports ---------- */
export const {
  setLoading,
  setError,
  setCarts,
  addToCart,
  updateCartItem,
  removeCartItem,
  setCurrentCartItem,
  clearAllCart,
} = cartSlice.actions;

export default cartSlice.reducer;
