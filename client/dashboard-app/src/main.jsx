import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { MantineProvider } from "@mantine/core";
import ClickSpark from "./components/ClickSpark";

// eslint-disable-next-line no-unused-vars
const a = import.meta.env.BASE_URL || "/";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MantineProvider>
      <BrowserRouter
      /////
      ////
      ///remove-this
      // basename={a}
      >
        <ClickSpark
          sparkColor="#69ddc8"
          sparkSize={9}
          sparkRadius={20}
          sparkCount={6}
          duration={400}
        >
          <App />
        </ClickSpark>
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
);
