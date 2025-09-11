import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // or App.scss if you want

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
