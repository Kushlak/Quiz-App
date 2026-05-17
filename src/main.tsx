import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./style.css";

// main.tsx is the entry point of the React application - mounts the React app into the root DOM node in strict mode.
createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
