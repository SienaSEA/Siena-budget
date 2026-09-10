import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// El service worker solo se registra en el sitio real (producción) —
// nunca en `npm run dev`, para no interferir con la vista previa local.
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // si falla, la app sigue funcionando normal, solo sin modo offline
    });
  });
}
