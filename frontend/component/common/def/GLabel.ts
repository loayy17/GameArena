import type { LabelHTMLAttributes, ReactNode } from "react";

interface GLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  children: ReactNode;
}

export type { GLabelProps };
