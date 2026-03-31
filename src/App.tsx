import { useState } from "react";
import "./App.css";
import AppFrame from "./components/app_frame";
import LocketTabBar from "./components/locket_tab_bar";
import RouteSwitcher from "./components/route_switcher";
import ThemeSwitcher from "./components/theme_switcher";
import { useTheme } from "./context/theme";
import StatusBar from "./components/status_bar";

import { TUXApp } from "@byted-tiktok/tux-web";

import CreationPage from "./page/creation_page";

function App() {
  const { resolvedTheme } = useTheme();
  const [isPreview, setIsPreview] = useState(false);

  return (
    <TUXApp theme="dark" textDirection="ltr" platform="iOS">
      <AppFrame backgroundColor="UIPageFlat1">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            backgroundColor: "#000",
          }}
        >
          {/* Status bar — only visible in the sm desktop mockup */}
          <StatusBar />

          {/* Camera page fills the remaining space */}
          <div style={{ flex: "1 1 auto", minHeight: 0, position: "relative" }}>
            <CreationPage onPreviewChange={setIsPreview} />
          </div>

          {/* Locket tab bar — hidden during photo preview */}
          {!isPreview && <LocketTabBar />}
        </div>
      </AppFrame>

      <RouteSwitcher />
      <ThemeSwitcher />
    </TUXApp>
  );
}

export default App;
