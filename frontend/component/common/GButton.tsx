"use client";

import clsx from "clsx";
import { forwardRef } from "react";
import { useTranslation } from "@/hooks/useSetting";
import { en, type GButtonTranslation } from "@/component/i18n/GButton/en.i18n";
import { ar } from "@/component/i18n/GButton/ar.i18n";
import { GButtonProps } from "./def/GButton";
import { buttonSize, focusRing, rounded, transition } from "./tokens";

const variants = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover",
  secondary: "bg-surface border border-border text-text hover:border-primary",
  outline: "border border-border bg-transparent text-text hover:bg-surface-alt",
  ghost: "bg-transparent text-text-secondary hover:bg-primary/10 hover:text-text",
  danger: "bg-danger text-on-primary hover:bg-danger/90",
  success: "bg-success text-on-primary hover:bg-success/90",
  link: "bg-transparent text-primary hover:text-primary-hover underline-offset-4 hover:underline h-auto p-0",
  dangerOutline: "border border-danger/30 text-danger bg-transparent hover:bg-danger-bg",
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
    const isIconOnly = size === "icon" || (!children && (leftIcon || rightIcon));

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
          transition,
          focusRing,
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
