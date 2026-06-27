"use client";

import { forwardRef } from "react";
import clsx from "clsx";
import { TButtonProps } from "./def/TButton";
import { sizes } from "@/types";

const variants = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  secondary: "bg-surface border border-border hover:border-primary",
  ghost: "hover:bg-primary/10",
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
        {loading && (
          <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        )}

        {!loading && leftIcon}

        {children}

        {!loading && rightIcon}
      </button>
    );
  },
);

TButton.displayName = "TButton";

export { TButton };
