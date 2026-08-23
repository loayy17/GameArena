import { cn } from "@/lib/cn";
import Image from "next/image";

import { BrandText } from "@/component/common/BrandText";

import type { IBrandMarkProps } from "./def/BrandMark";

function BrandMark({ name, onClick, className }: IBrandMarkProps) {
  const content = (
    <>
      <Image src="/arena404_badge.png" alt="404 Arena" width={32} height={32} className="size-8 shrink-0 rounded-lg object-contain" priority />
      <BrandText name={name} className="truncate text-lg font-bold text-text" />
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cn("flex min-w-0 cursor-pointer items-center gap-2.5 text-start", className)}>
        {content}
      </button>
    );
  }

  return <div className={cn("flex min-w-0 items-center gap-2.5", className)}>{content}</div>;
}

export { BrandMark };
