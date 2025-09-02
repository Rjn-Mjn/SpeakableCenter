/**
 * Main entry point for Speakable client application
 */

// Import styles
import "./styles/Style.css";

// Import services
import "./services/main.js";
import "./services/font-loader.js";
import "./services/smooth-scroll-polyfill.js";

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
  console.log("Speakable Client Application Initialized");

  // Initialize routes
  initializeRoutes();
});

function initializeRoutes() {
  // Simple client-side routing
  const path = window.location.pathname;

  switch (path) {
    case "/":
      //   loadHomePage();
      break;
    case "/login":
      //   loadLoginPage();
      break;
    default:
      load404Page();
  }
}

function loadHomePage() {
  console.log("Loading home page...");
}

function loadLoginPage() {
  console.log("Loading login page...");
}

function load404Page() {
  console.log("Page not found");
}

export { initializeRoutes };
