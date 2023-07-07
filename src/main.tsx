import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import Router from "./components/Router.tsx";
import routes from "./routes.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router routes={routes} />
  </React.StrictMode>
);
