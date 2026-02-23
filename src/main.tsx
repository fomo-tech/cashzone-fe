import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.tsx";
import { GoogleOAuthProvider } from '@react-oauth/google';

// Lấy Google Client ID từ environment variables
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

// import { registerServiceWorker, initInstallPrompt } from "./utils/pwa";

// // Register Service Worker for PWA
// registerServiceWorker();

// // Initialize install prompt
// initInstallPrompt();

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);
