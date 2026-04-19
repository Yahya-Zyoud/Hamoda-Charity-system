import React from "react";
import ReactDOM from "react-dom/client";
import ProfilePage from "./pages/Profile/ProfilePage";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);