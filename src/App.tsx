import "./App.css";
import AppFrame from "./components/app_frame";

import { TUXApp } from "@byted-tiktok/tux-web";
import AppTabBarView from "./components/app_tab_bar_view";
import RouteSwitcher from "./components/route_switcher";
import ThemeSwitcher from "./components/theme_switcher";
import { useTheme } from "./context/theme";
import StatusBar from "./components/status_bar";

import HomePage from "./page/home_page";
import FriendsPage from "./page/friends_page";
import CreationPage from "./page/creation_page";
import InboxPage from "./page/inbox_page";
import ProfilePage from "./page/profile_page";

import {
  TUXIconExpExp02IconHomeFill,
  TUXIconExpExp02IconHome,
  TUXIconExpExp02IconFriends,
  TUXIconExpExp02IconFriendsFill,
  TUXIconExpExp02IconInbox,
  TUXIconExpExp02IconInboxFill,
  TUXIconExpExp02IconProfile,
  TUXIconExpExp02IconProfileFill,
} from "@byted-tiktok/tux-icons";
import CreationIcon from "./components/creation_icon";

function App() {
  const { resolvedTheme } = useTheme();

  return (
    <TUXApp theme={resolvedTheme} textDirection="ltr" platform="iOS">
      <AppFrame>
        <div className="flex flex-col h-full min-h-0">
          <StatusBar />

          <AppTabBarView
            className="flex-1 min-h-0"
            iconSize={24}
            tabs={
              [
                {
                  icon: TUXIconExpExp02IconHome,
                  activeIcon: TUXIconExpExp02IconHomeFill,
                  text: "Home",
                  themeOverride: "dark",
                },
                {
                  icon: TUXIconExpExp02IconFriends,
                  activeIcon: TUXIconExpExp02IconFriendsFill,
                  text: "Friends",
                  themeOverride: "dark",
                },
                {
                  icon: CreationIcon,
                  activeIcon: CreationIcon,
                  themeOverride: "dark",
                },
                {
                  icon: TUXIconExpExp02IconInbox,
                  activeIcon: TUXIconExpExp02IconInboxFill,
                  text: "Inbox",
                },
                {
                  icon: TUXIconExpExp02IconProfile,
                  activeIcon: TUXIconExpExp02IconProfileFill,
                  text: "Profile",
                },
              ] as const
            }
            pages={
              [
                <HomePage />,
                <FriendsPage />,
                <CreationPage />,
                <InboxPage />,
                <ProfilePage />,
              ] as const
            }
          />
        </div>
      </AppFrame>

      <RouteSwitcher />

      <ThemeSwitcher />
    </TUXApp>
  );
}

export default App;
