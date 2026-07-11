"use client";

import clsx from "clsx";
import { forwardRef } from "react";
import { useTranslation } from "@/hooks/useSetting";
import { en, type GButtonTranslation } from "@/component/i18n/GButton/en.i18n";
import { ar } from "@/component/i18n/GButton/ar.i18n";
import type { GButtonProps } from "./def/GButton";

const variants = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover",
  secondary: "bg-surface border border-border text-text hover:border-primary",
  outline:
    "border border-border bg-transparent text-text hover:bg-primary-muted",
  ghost:
    "bg-transparent text-text-secondary hover:bg-primary-muted hover:text-text",
  danger: "bg-danger text-on-primary hover:bg-danger/90",
  success: "bg-success text-on-primary hover:bg-success/90",
  link: "bg-transparent text-primary hover:text-primary-hover underline-offset-4 hover:underline h-auto p-0",
  dangerOutline:
    "border border-danger/30 text-danger bg-transparent hover:bg-danger-bg",
};

const buttonSize: Record<string, string> = {
  xs: "h-7 px-2 text-xs gap-1",
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
  xl: "h-14 px-8 text-lg gap-2.5",
};

const rounded: Record<string, string> = {
  sm: "rounded-[var(--radius-sm)]",
  md: "rounded-[var(--radius-md)]",
  lg: "rounded-[var(--radius-lg)]",
  full: "rounded-full",
};

const GButton = forwardRef<HTMLButtonElement, GButtonProps>(
  (
    {
      children,
      loading,
      disabled,
      variant = "primary",
      size = "md",
      rounded: roundedProp = "md",
      className,
      leftIcon,
      rightIcon,
      loadingText,
      fullWidth,
      fab,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const t = useTranslation({ en, ar }) as GButtonTranslation;
    const isDisabled = disabled || loading;
    const resolvedLoadingText = loadingText ?? t.loading;
    const isIconOnly =
      size === "icon" || (!children && (leftIcon || rightIcon));

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={clsx(
          "inline-flex items-center justify-center font-medium",
          variant !== "link" && buttonSize[isIconOnly ? "sm" : size],
          isIconOnly && "h-10 w-10 p-0",
          variant !== "link" && rounded[roundedProp],
          "transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
          variants[variant],
          fullWidth && "w-full",
          fab && "fixed z-40",
          isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className,
        )}
        {...props}
      >
        {loading ? (
          <span className="opacity-70">{resolvedLoadingText}</span>
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </button>
    );
  },
);

GButton.displayName = "GButton";

export { GButton };
