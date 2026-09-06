import { cn } from "@/lib/cn";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { pageSize } from "@/domain/constant/style-tokens";

import type { IGPageProps } from "./def/GPage";

function GPage({ children, size = SizeEnum.md, className }: IGPageProps) {
  return (
    <div className={cn("p-6 sm:p-8 lg:p-10", className)}>
      <div className={cn("mx-auto w-full", pageSize[size])}>{children}</div>
    </div>
  );
}

export { GPage };
