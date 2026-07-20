import clsx from "clsx";
import type { GCardProps } from "./def/GCard";

const variants = {
  default: "bg-bg-card border border-border transition-all duration-300",
  elevated: "bg-bg-elevated border border-border shadow-md transition-all duration-300 hover:shadow-xl hover:border-border-light",
  glass: "bg-bg-card border border-border backdrop-blur-xl transition-all duration-300 hover:border-border-light hover:shadow-xl hover:shadow-glow",
  interactive: "bg-bg-card border border-border transition-all duration-300 hover:border-border-light hover:bg-bg-card-hover hover:-translate-y-0.5 cursor-pointer",
  outlined: "bg-transparent border border-border-light transition-all duration-300 hover:border-border",
  gradient: "bg-bg-card border border-border relative before:content-[''] before:absolute before:-inset-[1px] before:rounded-[inherit] before:bg-gradient-to-br before:from-primary before:via-secondary before:to-accent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
};

const paddings = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
  xl: "p-8",
};

const rounded: Record<string, string> = {
  sm: "rounded-[var(--radius-sm)]",
  md: "rounded-[var(--radius-md)]",
  lg: "rounded-[var(--radius-lg)]",
  xl: "rounded-[var(--radius-xl)]",
  "2xl": "rounded-[var(--radius-2xl)]",
  full: "rounded-full",
};

function GCard({ variant = "default", padding = "md", rounded: roundedProp = "lg", className, children, ...props }: GCardProps) {
  return (
    <div
      className={clsx(
        variants[variant],
        paddings[padding],
        rounded[roundedProp],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { GCard };
