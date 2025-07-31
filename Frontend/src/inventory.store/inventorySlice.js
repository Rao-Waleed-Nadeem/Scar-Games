import { createSlice } from "@reduxjs/toolkit";

/* ---------- initial state ---------- */
const initialState = {
  inventories: [], // list of all games
  currentInventory: null, // single‑game view
  loading: false,
  error: null,
};

/* ---------- slice ---------- */
const inventorySlice = createSlice({
  name: "inventories", // ← only ONE name
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setInventories: (state, action) => {
      state.inventories = action.payload;
    },
    addInventory: (state, action) => {
      state.inventories.push(action.payload);
    },
    updateInventoryInState: (state, action) => {
      const idx = state.inventories.findIndex(
        (g) => g.game_id === action.payload.game_id
      );
      if (idx !== -1) state.inventories[idx] = action.payload;
    },

    removeInventoryFromState: (state, action) => {
      state.inventories = state.inventories.filter(
        (g) => g.game_id !== action.payload
      );
    },

    setCurrentInventory: (state, action) => {
      state.currentInventory = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  setInventories,
  addInventory,
  updateInventoryInState,
  setCurrentInventory,
  removeInventoryFromState,
} = inventorySlice.actions;

export default inventorySlice.reducer;
