import type { HTMLAttributes, ReactNode } from "react";

interface IGAsideProps extends HTMLAttributes<HTMLElement> {
  side?: "start" | "end";
  label?: string;
  children: ReactNode;
}

export type { IGAsideProps };
