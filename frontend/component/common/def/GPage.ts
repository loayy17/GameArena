import type { ReactNode } from "react";

type GPageWidth = "sm" | "md" | "lg" | "xl";

interface GPageProps {
  children: ReactNode;
  width?: GPageWidth;
  className?: string;
}

export type { GPageProps, GPageWidth };
