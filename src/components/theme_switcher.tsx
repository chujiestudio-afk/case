import { TUXSegmentedControl } from "@byted-tiktok/tux-web";

import { useTheme, type ThemeMode } from "../context/theme";

const ITEMS = [
  { itemKey: "system", title: "System" },
  { itemKey: "light", title: "Light" },
  { itemKey: "dark", title: "Dark" },
] as const;

function isThemeMode(value: string): value is ThemeMode {
  return value === "system" || value === "light" || value === "dark";
}

export default function ThemeSwitcher() {
  const { mode, setMode } = useTheme();

  return (
    <div
      className="hidden sm:block right-4 bottom-4 z-50 fixed"
      aria-label="Theme"
    >
      <TUXSegmentedControl
        items={[...ITEMS]}
        activeKey={mode}
        sizePreset="small"
        shapePreset="capsule"
        fitContent={true}
        onChange={(key) => {
          if (isThemeMode(key)) setMode(key);
        }}
      />
    </div>
  );
}
