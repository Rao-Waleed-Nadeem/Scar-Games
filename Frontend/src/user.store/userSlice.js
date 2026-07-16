import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
  userLoggedIn: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.userLoggedIn = Boolean(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUserLoggedIn: (state, action) => {
      state.userLoggedIn = action.payload;
    },
  },
});

export const { setUser, setLoading, setUserLoggedIn } = userSlice.actions;

export default userSlice.reducer;
