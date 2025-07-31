import React from "react";
import ReactDOM from "react-dom/client";
import { store, persistor } from "./utils/store.js";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App.jsx";
import { Provider } from "react-redux";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    </PersistGate>
  </Provider>
);
