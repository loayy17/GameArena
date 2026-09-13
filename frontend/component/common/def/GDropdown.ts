import type { ReactNode } from "react";

interface IGDropdownProps {
  open: boolean;
  onClose: () => void;
  trigger: ReactNode;
  children: ReactNode;
  align?: "top" | "left" | "right" | "end";
  className?: string;
  triggerClassName?: string;
}

export type { IGDropdownProps };