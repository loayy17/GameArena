import clsx from "clsx";
import type { IGPageProps } from "./def/GPage";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { pageSize } from "@/domain/constant/size-classes";

function GPage({ children, size = SizeEnum.md, className }: IGPageProps) {
  return (
    <div className={clsx("p-6 sm:p-8 lg:p-10", className)}>
      <div className={clsx("mx-auto w-full", pageSize[size])}>{children}</div>
    </div>
  );
}

export { GPage };
