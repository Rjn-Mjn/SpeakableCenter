import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { MantineProvider } from "@mantine/core";
import ClickSpark from "./components/ClickSpark";
import NetworkHandler from "./components/NetworkHandler";

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
        <NetworkHandler>
          <App />
        </NetworkHandler>
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
);

// if ("serviceWorker" in navigator && import.meta.env.PROD) {
//   window.addEventListener("load", () => {
//     navigator.serviceWorker
//       .register("/dashboard/service-worker.js", { scope: "/dashboard/" })
//       .then((reg) => {
//         console.log("SW registered for /dashboard/:", reg.scope);

//         // optional: listen for updates
//         reg.addEventListener("updatefound", () => {
//           console.log("New SW found, installing...");
//           const sw = reg.installing;
//           sw?.addEventListener("statechange", () => {
//             console.log("SW state:", sw.state);
//             if (sw.state === "installed") {
//               // new content available (you can notify user to refresh)
//             }
//           });
//         });
//       })
//       .catch((err) => console.error("SW registration failed:", err));
//   });
// }

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", async () => {
    try {
      const reg = await navigator.serviceWorker.register(
        "/dashboard/service-worker.js",
        { scope: "/dashboard/" }
      );
      console.log("service worker registered", reg.scope);

      // nếu có waiting SW (đã install nhưng chờ), gửi skip message
      if (reg.waiting) {
        reg.waiting.postMessage({ type: "SKIP_WAITING" });
      }

      // listen for controller change to reload once
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        console.log("controllerchange event fired");
        // reload once to be served by SW
        if (!window.__sw_reloading) {
          window.__sw_reloading = true;
          window.location.reload();
        }
      });
    } catch (err) {
      console.error("SW register failed", err);
    }
  });
}
