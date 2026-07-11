import clsx from "clsx";
import type { GPageProps } from "./def/GPage";

const pageWidth: Record<string, string> = {
  sm: "max-w-xl",
  md: "max-w-3xl",
  lg: "max-w-5xl",
  xl: "max-w-7xl",
};

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
