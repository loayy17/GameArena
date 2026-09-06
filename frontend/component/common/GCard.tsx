import { cn } from "@/lib/cn";
import { CardVariantEnum } from "@/domain/enum/CardVariantEnum";
import { cardVariantStyles } from "@/domain/constant/style-tokens";

import type { IGCardProps } from "./def/GCard";

function GCard({ variant = CardVariantEnum.Default, className, children, ref, ...props }: IGCardProps) {
  return (
    <div
      ref={ref}
      className={cn("rounded-2xl p-5", cardVariantStyles[variant], className)}
      {...props}>
      {children}
    </div>
  );
}

export { GCard };
