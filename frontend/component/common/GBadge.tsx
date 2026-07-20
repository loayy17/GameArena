import clsx from "clsx";
import type { GBadgeProps } from "./def/GBadge";

const variants = {
  primary: "bg-primary-muted text-primary",
  secondary: "bg-secondary-muted text-secondary",
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  danger: "bg-error-muted text-error",
  muted: "bg-surface text-text-secondary border border-border",
};

const sizes = {
  sm: "text-2xs",
  md: "",
};

const badgeBase = "inline-flex items-center gap-1 text-xs font-semibold rounded-full px-2.5 py-0.5 whitespace-nowrap";

function GBadge({ variant = "primary", size = "md", className, children, ...props }: GBadgeProps) {
  return (
    <span className={clsx(badgeBase, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
}

export { GBadge };
