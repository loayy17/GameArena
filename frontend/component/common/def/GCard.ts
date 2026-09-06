import type { HTMLAttributes, ReactNode, Ref } from "react";
import type { CardVariantEnum } from "@/domain/enum/CardVariantEnum";

interface IGCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariantEnum;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export type { IGCardProps };
