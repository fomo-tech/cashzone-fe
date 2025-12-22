import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.tsx";
// import { registerServiceWorker, initInstallPrompt } from "./utils/pwa";

// // Register Service Worker for PWA
// registerServiceWorker();

// // Initialize install prompt
// initInstallPrompt();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
