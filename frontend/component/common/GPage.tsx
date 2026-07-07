import clsx from "clsx";
import type { GPageProps } from "./def/GPage";
import { pageWidth } from "./tokens";

function GPage({ children, width = "md", className }: GPageProps) {
  return (
    <div
      className={clsx(
        "h-full overflow-y-auto custom-scrollbar px-4 py-6 sm:px-8 sm:py-10",
        className,
      )}
    >
      <div className={clsx("mx-auto flex flex-col gap-6", pageWidth[width])}>
        {children}
      </div>
    </div>
  );
}

export { GPage };
