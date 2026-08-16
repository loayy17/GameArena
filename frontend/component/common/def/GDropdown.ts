import type { ReactNode } from "react";

interface IGDropdownProps {
  open: boolean;
  onClose: () => void;
  trigger: ReactNode;
  children: ReactNode;
  align?: "top" | "left" | "right" | "end";
  className?: string;
}

export type { IGDropdownProps };
