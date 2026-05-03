import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#1e1e2e",
            color: "#cdd6f4",
            border: "1px solid #313244",
            borderRadius: "12px",
            fontSize: "0.9rem",
          },
          success: { iconTheme: { primary: "#a6e3a1", secondary: "#1e1e2e" } },
          error: { iconTheme: { primary: "#f38ba8", secondary: "#1e1e2e" } },
        }}
      />
    </BrowserRouter>
  </StrictMode>
);
