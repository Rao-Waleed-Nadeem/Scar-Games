import { createSlice } from "@reduxjs/toolkit";

/* ---------- initial state ---------- */
const initialState = {
  payments: [], // list of all payments
  currentPayment: null, // single-payment view
  loading: false,
  error: null,
};

/* ---------- slice ---------- */
const paymentSlice = createSlice({
  name: "payments", // ← only ONE name
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setPayments: (state, action) => {
      state.payments = action.payload;
    },
    addPayment: (state, action) => {
      state.payments.push(action.payload);
    },
    updatePaymentInState: (state, action) => {
      const idx = state.payments.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.payments[idx] = action.payload;
    },
    removePaymentFromState: (state, action) => {
      state.payments = state.payments.filter((p) => p.id !== action.payload);
    },
    setCurrentPayment: (state, action) => {
      state.currentPayment = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  setPayments,
  addPayment,
  updatePaymentInState,
  removePaymentFromState,
  setCurrentPayment,
} = paymentSlice.actions;

export default paymentSlice.reducer;
