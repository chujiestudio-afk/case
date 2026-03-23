import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";

const FALLBACK_TAB_NUMBERS = [1, 2, 3, 4, 5] as const;

export type AppTabBarViewProps = {
  pages: readonly [ReactNode, ReactNode, ReactNode, ReactNode, ReactNode];
  tabs?: readonly [ReactNode, ReactNode, ReactNode, ReactNode, ReactNode];
  /** @deprecated Use `tabs` instead. */
  labels?: readonly [ReactNode, ReactNode, ReactNode, ReactNode, ReactNode];
  activeIndex?: number;
  defaultActiveIndex?: number;
  onChange?: (activeIndex: number) => void;
  className?: string;
  style?: CSSProperties;
};

const AppTabBarView = ({
  pages,
  tabs,
  labels,
  activeIndex,
  defaultActiveIndex = 0,
  onChange,
  className,
  style,
}: AppTabBarViewProps) => {
  const resolvedTabs =
    tabs ??
    labels ??
    FALLBACK_TAB_NUMBERS.map((n) => <span key={n}>{n}</span>);

  const [internalActiveIndex, setInternalActiveIndex] = useState(defaultActiveIndex);
  const resolvedActiveIndex = activeIndex ?? internalActiveIndex;

  return (
    <div
      data-component="AppTabBarView"
      className={className}
      style={{ display: "flex", flexDirection: "column", minHeight: 0, ...style }}
    >
      <div style={{ flex: "1 1 auto", minHeight: 0, overflow: "auto" }}>
        {pages.map((page, index) => (
          <div key={index} hidden={index !== resolvedActiveIndex}>
            {page}
          </div>
        ))}
      </div>

      <nav role="tablist" aria-label="Tabs">
        {resolvedTabs.map((tabNode, index) => {
          const selected = index === resolvedActiveIndex;
          return (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={selected}
              data-active={selected ? "true" : "false"}
              onClick={() => {
                onChange?.(index);
                if (activeIndex === undefined) setInternalActiveIndex(index);
              }}
            >
              {tabNode}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default AppTabBarView;
