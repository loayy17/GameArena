import { cn } from "@/lib/cn";
import { CardVariantEnum } from "@/domain/enum/CardVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import type { IGCardProps } from "./def/GCard";
import { paddingSize, radiusSize } from "@/domain/constant/size-classes";
import { cardVariantStyles } from "@/domain/constant/card-styles";

function GCard({
  variant = CardVariantEnum.Default,
  padding = SizeEnum.md,
  rounded: roundedProp = SizeEnum.lg,
  className,
  children,
  ...props
}: IGCardProps) {
  return (
    <div
      className={cn(
        cardVariantStyles[variant],
        paddingSize[padding],
        radiusSize[roundedProp],
        className,
      )}
      {...props}>
      {children}
    </div>
  );
}

export { GCard };
