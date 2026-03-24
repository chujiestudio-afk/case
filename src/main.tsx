import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@byted-tiktok/tux-web/styles.css";
import App from "./App.tsx";
import { ThemeProvider } from "./context/theme";

if (typeof window !== "undefined" && "ongesturestart" in window) {
  const prevent = (event: Event) => {
    event.preventDefault();
  };

  for (const type of ["gesturestart", "gesturechange", "gestureend"]) {
    document.addEventListener(type, prevent, { passive: false });
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
