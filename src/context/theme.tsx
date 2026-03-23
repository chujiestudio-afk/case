import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type ThemeMode = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export type ThemeContextValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  resolvedTheme: ResolvedTheme;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "tiktok_ux_demo.themeMode";

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === "system") return getSystemTheme();
  return mode;
}

function readStoredMode(): ThemeMode | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (value === "system" || value === "light" || value === "dark")
      return value;
    return null;
  } catch {
    return null;
  }
}

function writeStoredMode(mode: ThemeMode) {
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // ignore
  }
}

function applyResolvedThemeToDom(resolvedTheme: ResolvedTheme) {
  // TUX styles are keyed off [data-tux-color-scheme="light"|"dark"]
  document.documentElement.setAttribute("data-tux-color-scheme", resolvedTheme);
  // Also hint native form controls
  (document.documentElement.style as any).colorScheme = resolvedTheme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(
    () => readStoredMode() ?? "system",
  );
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    resolveTheme(mode),
  );

  const modeRef = useRef(mode);
  modeRef.current = mode;

  const setMode = useCallback((nextMode: ThemeMode) => {
    setModeState(nextMode);
    writeStoredMode(nextMode);
  }, []);

  useEffect(() => {
    const nextResolved = resolveTheme(mode);
    setResolvedTheme(nextResolved);
    applyResolvedThemeToDom(nextResolved);
  }, [mode]);

  useEffect(() => {
    // Keep resolvedTheme in sync with system changes when mode=system
    if (typeof window === "undefined") return;
    const mql = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mql) return;

    const handleChange = () => {
      if (modeRef.current !== "system") return;
      const nextResolved = getSystemTheme();
      setResolvedTheme(nextResolved);
      applyResolvedThemeToDom(nextResolved);
    };

    // Safari compatibility
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", handleChange);
      return () => mql.removeEventListener("change", handleChange);
    }

    // eslint-disable-next-line deprecation/deprecation
    mql.addListener(handleChange);
    // eslint-disable-next-line deprecation/deprecation
    return () => mql.removeListener(handleChange);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, setMode, resolvedTheme }),
    [mode, resolvedTheme, setMode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
