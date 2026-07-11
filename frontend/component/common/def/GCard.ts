import type { HTMLAttributes, ReactNode } from "react";

interface GCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined" | "elevated" | "interactive";
  padding?: "none" | "sm" | "md" | "lg";
  rounded?: "sm" | "md" | "lg" | "full";
  children: ReactNode;
}

export type { GCardProps };
