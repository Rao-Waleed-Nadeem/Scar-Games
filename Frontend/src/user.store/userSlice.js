import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  user: null,
  loading: false,
  userLoggedIn: false, // Add userLoggedIn to track login status
};

// Create the slice
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.userLoggedIn = Boolean(action.payload); // Set userLoggedIn based on user data
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUserLoggedIn: (state, action) => {
      state.userLoggedIn = action.payload; // Manually set userLoggedIn
    },
  },
});

// Export actions
export const { setUser, setLoading, setUserLoggedIn } = userSlice.actions;

// Export reducer
export default userSlice.reducer;
