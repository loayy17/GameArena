import type { TextareaHTMLAttributes } from "react";
import type { GSize } from "../tokens";

interface GTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  size?: GSize;
}

export type { GTextareaProps };
