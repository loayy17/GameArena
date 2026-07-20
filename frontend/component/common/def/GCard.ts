import type { HTMLAttributes, ReactNode } from "react";

interface GCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined" | "elevated" | "interactive" | "glass";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  children: ReactNode;
}

export type { GCardProps };
