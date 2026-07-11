import type { TextareaHTMLAttributes } from "react";

interface GTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export type { GTextareaProps };
