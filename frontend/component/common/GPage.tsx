import clsx from "clsx";
import type { GPageProps } from "./def/GPage";

const pageWidth: Record<string, string> = {
  sm: "max-w-[36rem]",
  md: "max-w-[48rem]",
  lg: "max-w-[72rem]",
  xl: "max-w-[80rem]",
};

function GPage({ children, width = "md", className }: GPageProps) {
  return (
    <div className={clsx("flex-1 min-h-0 p-6 sm:p-8 lg:p-10", className)}>
      <div className={clsx("mx-auto w-full", pageWidth[width])}>
        {children}
      </div>
    </div>
  );
}

export { GPage };
