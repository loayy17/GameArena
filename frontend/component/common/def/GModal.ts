import type { HTMLAttributes, ReactNode } from "react";
import type { SizeEnum } from "@/domain/enum/SizeEnum";

export type GModalSide = "center" | "start" | "end" | "bottom";

interface IGModalProps extends Omit<HTMLAttributes<HTMLDivElement>, "onClick"> {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: SizeEnum;
  side?: GModalSide;
  className?: string;
  panelClassName?: string;
  role?: "dialog" | "alertdialog";
  ariaLabel?: string;
}

export type { IGModalProps };
