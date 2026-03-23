import "./App.css";
import AppFrame from "./components/app_frame";

import { TUXApp, TUXNavBar } from "@byted-tiktok/tux-web";
import AppTabBarView from "./components/app_tab_bar_view";
import ThemeSwitcher from "./components/theme_switcher";
import { useTheme } from "./context/theme";
import StatusBar from "./components/status_bar";

function App() {
  const { resolvedTheme } = useTheme();

  return (
    <TUXApp theme={resolvedTheme} textDirection="ltr" platform="desktop">
      <AppFrame>
        <div className="flex flex-col h-full min-h-0">
          <StatusBar />
          <TUXNavBar title="TikTok UX Demo" showSeparator={true} />

          <AppTabBarView
            className="flex-1 min-h-0"
            tabs={[<div>Tab1</div>, <div>Tab2</div>, <div>Tab3</div>, <div>Tab4</div>, <div>Tab5</div>] as const}
            pages={[<div>1</div>, <div>2</div>, <div>3</div>, <div>4</div>, <div>5</div>] as const}
          />
        </div>
      </AppFrame>

      <ThemeSwitcher />
    </TUXApp>
  );
}

export default App;
