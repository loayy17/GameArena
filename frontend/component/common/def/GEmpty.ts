import type { ReactNode } from "react";
import type { SizeEnum } from "@/domain/enum/SizeEnum";

interface IGEmptyProps {
  icon?: ReactNode;
  title: string;
  description: string;
  padding?: SizeEnum;
  className?: string;
  children?: ReactNode;
}

export type { IGEmptyProps };
