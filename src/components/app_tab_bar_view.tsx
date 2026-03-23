import { createElement, isValidElement, useEffect, useState } from "react";
import type {
  CSSProperties,
  ComponentType,
  ReactElement,
  ReactNode,
} from "react";

import { useTheme, type ThemeMode } from "../context/theme";

type Five<T> = readonly [T, T, T, T, T];

export type AppTabBarViewIcon =
  | ReactElement
  | ComponentType<{
      size?: number;
      [key: string]: unknown;
    }>;

export type AppTabBarViewTabItem = {
  icon: AppTabBarViewIcon;
  activeIcon: AppTabBarViewIcon;
  text?: ReactNode;
  themeOverride?: ThemeMode;
};

type AppTabBarViewBaseProps = {
  pages: Five<ReactNode>;
  activeIndex?: number;
  defaultActiveIndex?: number;
  onChange?: (activeIndex: number) => void;
  className?: string;
  style?: CSSProperties;
  iconSize?: number;
  themeOverrides?: Five<ThemeMode | undefined>;
};

type AppTabBarViewPropsWithTabs = AppTabBarViewBaseProps & {
  tabs: Five<AppTabBarViewTabItem>;
};

type AppTabBarViewPropsWithIcons = AppTabBarViewBaseProps & {
  icons: Five<AppTabBarViewIcon>;
  activeIcons: Five<AppTabBarViewIcon>;
  texts?: Five<ReactNode | undefined>;
};

export type AppTabBarViewProps =
  | AppTabBarViewPropsWithTabs
  | AppTabBarViewPropsWithIcons;

const renderIcon = (iconLike: AppTabBarViewIcon, size: number) =>
  isValidElement(iconLike)
    ? iconLike
    : createElement(iconLike as ComponentType<any>, { size });

const normalizeTabItems = (
  props: AppTabBarViewProps,
): Five<AppTabBarViewTabItem> => {
  if ("tabs" in props)
    return props.tabs.map((tab, index) => ({
      ...tab,
      themeOverride: tab.themeOverride ?? props.themeOverrides?.[index],
    })) as unknown as Five<AppTabBarViewTabItem>;

  return props.icons.map((icon, index) => ({
    icon,
    activeIcon: props.activeIcons[index],
    text: props.texts?.[index],
    themeOverride: props.themeOverrides?.[index],
  })) as unknown as Five<AppTabBarViewTabItem>;
};

const AppTabBarView = (props: AppTabBarViewProps) => {
  const {
    pages,
    activeIndex,
    defaultActiveIndex = 0,
    onChange,
    className,
    style,
    iconSize = 24,
  } = props;

  const { setForcedMode } = useTheme();

  const tabItems = normalizeTabItems(props);

  const [internalActiveIndex, setInternalActiveIndex] =
    useState(defaultActiveIndex);
  const resolvedActiveIndex = activeIndex ?? internalActiveIndex;

  const activeThemeOverride =
    tabItems[resolvedActiveIndex]?.themeOverride ?? null;

  useEffect(() => {
    setForcedMode(activeThemeOverride);
  }, [activeThemeOverride, setForcedMode]);

  useEffect(() => {
    return () => setForcedMode(null);
  }, [setForcedMode]);

  const setActiveIndex = (index: number) => {
    onChange?.(index);
    if (activeIndex === undefined) setInternalActiveIndex(index);
  };

  return (
    <div
      data-component="AppTabBarView"
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        ...style,
      }}
    >
      <div style={{ flex: "1 1 auto", minHeight: 0, overflow: "auto" }}>
        {pages.map((page, index) => (
          <div key={index} hidden={index !== resolvedActiveIndex}>
            {page}
          </div>
        ))}
      </div>

      <nav
        role="tablist"
        aria-label="Tabs"
        className="flex flex-col flex-none bg-tux-v2-ui-page-flat-1 shadow-[0_-1px_0_0_var(--tux-v2-color-ui-shape-neutral-3)] font-semibold text-[10px] text-tux-v2-ui-text-1-display leading-1"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex flex-row justify-between">
          {tabItems.map((tab, index) => {
            const selected = index === resolvedActiveIndex;
            const icon = renderIcon(
              selected ? tab.activeIcon : tab.icon,
              iconSize,
            );

            return (
              <button
                key={index}
                className="flex-auto"
                type="button"
                role="tab"
                aria-selected={selected}
                data-active={selected ? "true" : "false"}
                onClick={() => setActiveIndex(index)}
              >
                <span className="flex flex-col justify-center items-center">
                  <span className="leading-none">{icon}</span>
                  {tab.text == null ? null : (
                    <span className="mt-0.75 leading-none">{tab.text}</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <div className="hidden md:flex justify-center items-end pb-2 w-full h-8.5">
          <div className="rounded-full w-36 h-1.25 bg-tux-v2-ui-text-1" />
        </div>
      </nav>
    </div>
  );
};

export default AppTabBarView;
