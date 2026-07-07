import clsx from "clsx";
import type { GBadgeProps } from "./def/GBadge";
import { rounded } from "./tokens";

const variants = {
  primary: "bg-primary/10 text-primary border-primary/20",
  secondary: "bg-surface-alt text-text-secondary border-border",
  success: "bg-success-bg text-success border-success/20",
  warning: "bg-warning-bg text-warning border-warning/20",
  danger: "bg-danger-bg text-danger border-danger/20",
  muted: "bg-text-muted/10 text-text-muted border-border",
};

const sizes = {
  sm: "px-2 py-0.5 text-2xs",
  md: "px-2.5 py-1 text-xs",
};

function GBadge({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: GBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 font-semibold border",
        rounded.full,
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { GBadge };
