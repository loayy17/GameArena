"use client";

import clsx from "clsx";
import { forwardRef } from "react";
import { GSpinner } from "./GSpinner";
import type { GButtonProps } from "./def/GButton";

const sizeStyles: Record<string, string> = {
  xs: "h-8 px-2.5 text-xs gap-1",
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-11 px-5 text-base gap-2",
  xl: "h-12 px-6 text-lg gap-2.5",
  icon: "h-10 w-10 p-0",
};

const roundedStyles: Record<string, string> = {
  sm: "rounded-[var(--radius-sm)]",
  md: "rounded-[var(--radius-md)]",
  lg: "rounded-[var(--radius-lg)]",
  xl: "rounded-[var(--radius-xl)]",
  full: "rounded-full",
};

const variantStyles: Record<string, string> = {
  primary:
    "bg-gradient-to-br from-primary to-primary-hover text-on-primary shadow-md shadow-glow hover:shadow-lg hover:shadow-glow-lg hover:-translate-y-px active:translate-y-0",
  secondary:
    "bg-surface text-text border border-border hover:bg-surface-hover hover:border-primary hover:text-primary",
  outline:
    "bg-transparent text-text border border-border hover:bg-primary-muted hover:border-primary hover:text-primary",
  ghost:
    "bg-transparent text-text-secondary hover:bg-primary-muted hover:text-primary",
  danger:
    "bg-gradient-to-br from-error to-error-hover text-on-primary shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0",
  success:
    "bg-gradient-to-br from-success to-success-hover text-on-primary shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0",
  link: "bg-transparent text-primary hover:text-primary-hover underline-offset-4 hover:underline h-auto p-0",
  dangerOutline: "bg-transparent text-error border border-error/30 hover:bg-error-muted",
};

const GButton = forwardRef<HTMLButtonElement, GButtonProps>(
  (
    {
      children,
      loading,
      disabled,
      variant = "primary",
      size = "md",
      rounded = "md",
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
    const isDisabled = disabled || loading;
    const resolvedLoadingText = loadingText ?? "Loading...";
    const isIconOnly = !children && (leftIcon || rightIcon);

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={clsx(
          "inline-flex items-center justify-center font-semibold whitespace-nowrap cursor-pointer gap-2 transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          variantStyles[variant],
          sizeStyles[size],
          roundedStyles[rounded],
          fullWidth && "w-full",
          fab && "fixed z-[var(--z-fixed)]",
          isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
          isIconOnly && size !== "icon" && "p-0",
          className,
        )}
        {...props}
      >
        {loading ? (
          <span className="opacity-70 flex items-center gap-1.5">
            <GSpinner size="sm" />
            {resolvedLoadingText}
          </span>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  },
);

GButton.displayName = "GButton";

export { GButton };
