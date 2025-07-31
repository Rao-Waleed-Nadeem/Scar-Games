// src/store/cartThunk.js
import {
  setLoading,
  setError,
  setCarts,
  addToCart,
  updateCartItem,
  clearAllCart,
  removeCartItem,
  setCurrentCartItem,
} from "./cartSlice";
import { loadCartFromStorage, saveCartToStorage } from "./cartStorage";

/* ---------- FETCH (init) ---------- */
export const fetchCart = () => (dispatch) => {
  dispatch(setLoading(true));
  try {
    const carts = loadCartFromStorage();
    dispatch(setCarts(carts));
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

/* ---------- ADD ---------- */
export const addGameToCart = (item) => (dispatch, getState) => {
  dispatch(addToCart(item));
  const { cart } = getState(); // get updated state
  saveCartToStorage(cart.carts);
};

/* ---------- UPDATE quantity ---------- */
export const updateCartQuantity =
  ({ game_id, quantity }) =>
  (dispatch, getState) => {
    dispatch(updateCartItem({ game_id, quantity }));
    // dispatch(fetchCart());
    const { carts } = getState();
    // console.log("carts: ", carts);
    saveCartToStorage(carts.carts);
  };

/* ---------- DELETE ---------- */
export const deleteCartItem = (game_id) => (dispatch, getState) => {
  // console.log("Deleting item with game_id:", game_id);
  dispatch(removeCartItem(game_id));

  const { carts } = getState();
  // console.log("Updated carts state:", carts);

  // Save the updated carts to local storage
  saveCartToStorage(carts.carts);
};

/* ---------- Optional: single item ---------- */
export const fetchCartItemById = (game_id) => (dispatch, getState) => {
  const item = getState().cart.carts.find((c) => c.game_id === game_id);
  dispatch(setCurrentCartItem(item || null));
};

export const clearAll = () => (dispatch) => {
  dispatch(clearAllCart()); // dispatch the action properly
  saveCartToStorage([]); // clear localStorage
};
