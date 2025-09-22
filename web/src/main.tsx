import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

// Mount the React app to the DOM
createRoot(document.getElementById("root")!).render(<App />);
