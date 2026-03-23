import { getColorCSSVar } from "@byted-tiktok/tux-web";
import type { ColorV2Name } from "@byted-tiktok/tux-color";
import type { ReactNode } from "react";

export type AppFrameProps = {
  children?: ReactNode;
  backgroundColor?: ColorV2Name;
};

const AppFrame = ({ children, backgroundColor = "UIPageFlat1" }: AppFrameProps) => {
  return (
    <div className="fixed inset-0 bg-tux-v2-ui-page-flat-2 w-full h-full">
      <div
        style={{ backgroundColor: getColorCSSVar(backgroundColor) }}
        className="sm:top-1/2 sm:left-1/2 sm:absolute relative w-full sm:w-100.5 h-screen sm:h-218.5 sm:-translate-x-1/2 sm:-translate-y-1/2"
      >
        {children}
      </div>
    </div>
  );
};

export default AppFrame;