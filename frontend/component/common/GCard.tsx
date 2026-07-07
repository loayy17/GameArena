import clsx from "clsx";
import type { GCardProps } from "./def/GCard";
import { rounded, transition } from "./tokens";

const variants = {
  default: "bg-bg-card border border-border",
  outlined: "bg-surface border border-border",
  elevated: "bg-bg-card border-2 border-border",
  interactive:
    "bg-bg-card border border-border hover:border-primary hover:bg-surface cursor-pointer",
};

const paddings = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

function GCard({
  variant = "default",
  padding = "md",
  rounded: roundedProp = "lg",
  className,
  children,
  ...props
}: GCardProps) {
  return (
    <div
      className={clsx(
        rounded[roundedProp],
        transition,
        variants[variant],
        paddings[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { GCard };
