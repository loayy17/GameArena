import type { HTMLAttributes, ReactNode } from "react";
import type { GRounded } from "../tokens";

interface GCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined" | "elevated" | "interactive";
  padding?: "none" | "sm" | "md" | "lg";
  rounded?: GRounded;
  children: ReactNode;
}

export type { GCardProps };
