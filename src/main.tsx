import { StrictMode } from "react";

import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import "./index.css";
import App from "./App.tsx";

// Remove data left by the retired email gate in earlier versions.
localStorage.removeItem("user-info");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
