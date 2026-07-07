/** Shared design tokens — consumed by G* components only. */

type GSize = "xs" | "sm" | "md" | "lg" | "xl";
type GRounded = "sm" | "md" | "lg" | "full";
type GGradient =
  | "brand"
  | "subtle-brand"
  | "game-green"
  | "game-cyan"
  | "game-magenta"
  | "play-cyan"
  | "play-green"
  | "play-magenta";
type GNavIndicator = "start" | "end" | "top" | "bottom" | "none";

const rounded: Record<GRounded, string> = {
  sm: "rounded-[var(--radius-sm)]",
  md: "rounded-[var(--radius-md)]",
  lg: "rounded-[var(--radius-lg)]",
  full: "rounded-full",
};

const pageWidth = {
  sm: "max-w-xl",
  md: "max-w-3xl",
  lg: "max-w-7xl",
  xl: "max-w-2xl",
};

const buttonSize: Record<GSize, string> = {
  xs: "h-7 px-2 text-xs gap-1",
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
  xl: "h-14 px-8 text-lg gap-2.5",
};

const iconSize: Record<GSize, string> = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
};

const avatarSize: Record<GSize, string> = {
  xs: "w-8 h-8 min-w-8 text-xs",
  sm: "w-10 h-10 min-w-10 text-sm",
  md: "w-16 h-16 min-w-16 text-lg",
  lg: "w-20 h-20 min-w-20 text-2xl",
  xl: "w-24 h-24 min-w-24 text-3xl",
};

const iconTileSize: Record<GSize, string> = {
  xs: "w-8 h-8",
  sm: "w-10 h-10",
  md: "w-12 h-12",
  lg: "w-14 h-14",
  xl: "w-16 h-16",
};

const inputSize: Record<GSize, string> = {
  xs: "px-3 py-1.5 text-xs",
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3 text-sm",
  lg: "px-4 py-3.5 text-base",
  xl: "px-5 py-4 text-base",
};

/** Classic flat fills — no white, no glow */
const gradient: Record<GGradient, string> = {
  brand: "bg-primary",
  "subtle-brand": "bg-primary-muted",
  "game-green": "bg-success-bg",
  "game-cyan": "bg-primary-muted",
  "game-magenta": "bg-warning-bg",
  "play-cyan": "text-primary",
  "play-green": "text-success",
  "play-magenta": "text-warning",
};

const navBase = {
  item: "relative flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium min-w-0",
  itemIdle: "text-text-secondary hover:bg-surface-alt hover:text-text",
  itemActive: "bg-primary-muted text-primary font-semibold",
};

const navIndicator: Record<
  GNavIndicator,
  { active: string; idle: string }
> = {
  start: {
    active: "border-s-[3px] border-s-primary",
    idle: "border-s-[3px] border-s-transparent",
  },
  end: {
    active: "border-e-[3px] border-e-primary",
    idle: "border-e-[3px] border-e-transparent",
  },
  top: {
    active: "border-t-[3px] border-t-primary",
    idle: "border-t-[3px] border-t-transparent",
  },
  bottom: {
    active: "border-b-[3px] border-b-primary",
    idle: "border-b-[3px] border-b-transparent",
  },
  none: { active: "", idle: "" },
};

const messageBubble = {
  base: "max-w-[85%] sm:max-w-[70%] min-w-0 px-4 py-2.5 text-sm leading-relaxed wrap-anywhere break-words",
  out: "ms-auto rounded-ee-sm bg-primary text-on-primary",
  in: "rounded-es-sm border border-border bg-surface text-text",
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25";

/** Color-only — no transform/shadow transitions */
const transition = "transition-colors duration-150";

export {
  type GSize,
  type GRounded,
  type GGradient,
  type GNavIndicator,
  rounded,
  pageWidth,
  buttonSize,
  iconSize,
  avatarSize,
  iconTileSize,
  inputSize,
  gradient,
  navBase,
  navIndicator,
  messageBubble,
  focusRing,
  transition,
};
