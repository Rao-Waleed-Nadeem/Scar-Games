import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "../user.store/userSlice.js";
import gameReducer from "../game.store/gameSlice.js";
import cartReducer from "../cart.store/cartSlice.js";
import orderReducer from "../order.store/orderSlice.js";
import orderItemReducer from "../orderItem.store/orderItemSlice.js";
import inventoryReducer from "../inventory.store/inventorySlice.js";
// import userReducer from "../user.store/userSlice.js";

// Combine the reducers
const rootReducer = combineReducers({
  // user: userReducer, // User slice
  games: gameReducer,
  currentGame: gameReducer,
  carts: cartReducer,
  cart: cartReducer,
  orders: orderReducer,
  orderHistory: orderReducer,
  inventories: inventoryReducer,
  currentInventory: inventoryReducer,
  orderItems: orderItemReducer,
  userLoggedIn: userReducer,
  user: userReducer,

  error: gameReducer,
  loading: gameReducer,
  // loading: videoReducer,
});

// Configure persistence
const persistConfig = {
  key: "root", // Root key for persistence
  storage,
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/FLUSH",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);
