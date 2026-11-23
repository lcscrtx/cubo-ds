import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "../../dist/tokens.css";
import "../../src/styles/base.css";
import "../../src/components/Badge.css";
import "../../src/components/Button.css";
import "../../src/components/Card.css";
import "../../src/components/Heading.css";
import "../../src/components/Alert.css";
import "../../src/components/StatusIcon.css";
import "../../src/components/TextField.css";
import "../../src/components/Fields.css";
import "../../src/components/Navigation.css";
import "../../src/components/Dialog.css";
import "../../src/components/Table.css";
import "../../src/components/Feedback.css";
import "../../src/components/Wave5.css";
import "../../src/components/Wave6.css";
import "../../src/components/Wave7.css";
import "../../src/components/Wave8.css";
import "./site.css";
import "./home/home.css";
import "./chrome.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
