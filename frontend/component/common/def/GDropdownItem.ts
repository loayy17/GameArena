import type { LucideIcon } from "lucide-react";

interface IGDropdownItemProps {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export type { IGDropdownItemProps };
