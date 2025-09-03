import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// eslint-disable-next-line no-unused-vars
const a = import.meta.env.BASE_URL || "/";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter
    /////
    ////
    ///remove-this
    // basename={a}
    >
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
