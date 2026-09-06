import type { ReactNode } from "react";

type TPosition = {
  x: number;
  y: number;
};

interface IGDropdownProps {
  open: boolean;
  onClose: () => void;
  trigger: ReactNode;
  children: ReactNode;
  align?: "top" | "left" | "right" | "end";
  className?: string;
  triggerClassName?: string;
}

export type { IGDropdownProps, TPosition };
