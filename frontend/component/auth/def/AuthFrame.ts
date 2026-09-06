import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface IAuthFrameProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  backLabel?: string;
  children: ReactNode;
}

export type { IAuthFrameProps };
