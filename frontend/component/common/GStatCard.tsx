import clsx from "clsx";
import { GIcon } from "./GIcon";
import type { GStatCardProps } from "./def/GStatCard";
import { rounded, transition } from "./tokens";

const iconColors = {
  primary: "primary",
  success: "success",
  warning: "warning",
  danger: "danger",
  muted: "muted",
} as const;

function GStatCard({
  label,
  value,
  icon,
  iconColor = "primary",
  size = "md",
}: GStatCardProps) {
  return (
    <div
      className={clsx(
        "flex items-center gap-3 p-4 bg-bg-card border border-border",
        rounded.lg,
        transition,
        "hover:border-primary",
      )}
    >
      <GIcon icon={icon} size={size === "lg" ? "lg" : "md"} color={iconColors[iconColor]} />
      <div className="min-w-0">
        <p className="text-xl font-bold text-text leading-none">{value}</p>
        <p className="text-xs text-text-secondary mt-1 truncate">{label}</p>
      </div>
    </div>
  );
}

export { GStatCard };
