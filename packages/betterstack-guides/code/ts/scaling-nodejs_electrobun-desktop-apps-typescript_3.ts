# Source: https://betterstack.com/community/guides/scaling-nodejs/electrobun-desktop-apps-typescript/
# Original language: tsx
# Normalized: ts
# Block index: 3

[label src/frontend.tsx]
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);