"use client";

import { forwardRef } from "react";
import clsx from "clsx";
import { TButtonProps } from "./def/TButton";
import { sizes } from "@/types";
import { useTranslation } from "@/Hooks/useTranslation";
import { en, type TButtonTranslation } from "@/component/i18n/TButton/en.i18n";
import { ar } from "@/component/i18n/TButton/ar.i18n";
const variants = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  secondary: "bg-surface border border-border text-text hover:border-primary",
  ghost: "hover:bg-primary/10 text-text-secondary hover:text-text",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

const TButton = forwardRef<HTMLButtonElement, TButtonProps>(
  (
    {
      children,
      loading,
      disabled,
      variant = "primary",
      size = "md",
      className,
      leftIcon,
      rightIcon,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const t = useTranslation({ en, ar }) as TButtonTranslation;
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={clsx(
          "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 active:scale-95",
          variants[variant],
          sizes[size],
          isDisabled && "opacity-50 cursor-not-allowed",
          className,
        )}
        {...props}
      >
        {loading && t.loading}

        {!loading && leftIcon}
        {!loading && children}

        {!loading && rightIcon}
      </button>
    );
  },
);

TButton.displayName = "TButton";

export { TButton };
