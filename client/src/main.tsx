import React from "react";
import "antd/dist/reset.css";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ConfigProvider, theme } from "antd";
import ru from "antd/locale/ru_RU";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }} locale={ru}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
