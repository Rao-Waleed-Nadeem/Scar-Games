import { createSlice } from "@reduxjs/toolkit";

/* ---------- initial state ---------- */
const initialState = {
  games: [], // list of all games
  currentGame: null, // single‑game view
  loading: false,
  error: null,
};

/* ---------- slice ---------- */
const gameSlice = createSlice({
  name: "games", // ← only ONE name
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setGames: (state, action) => {
      state.games = action.payload;
    },
    addGame: (state, action) => {
      state.games.push(action.payload);
    },
    updateGameInState: (state, action) => {
      const idx = state.games.findIndex((g) => g.id === action.payload.id);
      if (idx !== -1) state.games[idx] = action.payload;
    },
    removeGameFromState: (state, action) => {
      state.games = state.games.filter((g) => g.id !== action.payload);
    },
    setCurrentGame: (state, action) => {
      state.currentGame = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  setGames,
  addGame,
  updateGameInState,
  removeGameFromState,
  setCurrentGame,
} = gameSlice.actions;

export default gameSlice.reducer;
