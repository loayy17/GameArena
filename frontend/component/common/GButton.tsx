"use client";

import clsx from "clsx";
import { forwardRef } from "react";
import { GSpinner } from "./GSpinner";
import type { IGButtonProps } from "./def/GButton";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { AccentBackGroundEnum } from "@/domain/enum/AccentBackGroundEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { controlSize, radiusSize } from "@/domain/constant/size-classes";

const ghostSubtle = `${AccentBackGroundEnum.Transparent} text-text-secondary hover:bg-primary-muted hover:text-text`;

const variantStyles: Record<ButtonVariantEnum, string> = {
  [ButtonVariantEnum.Primary]: `${AccentBackGroundEnum.Primary} text-on-primary hover:bg-primary-hover`,
  [ButtonVariantEnum.Secondary]: `${AccentBackGroundEnum.Surface} text-text border border-border ${AccentBackGroundEnum.SurfaceHover}`,
  [ButtonVariantEnum.Subtle]: ghostSubtle,
  [ButtonVariantEnum.Danger]: `${AccentBackGroundEnum.Danger} text-on-primary hover:bg-danger`,
};

const GButton = forwardRef<HTMLButtonElement, IGButtonProps>(
  (
    {
      children,
      loading,
      disabled,
      variant = ButtonVariantEnum.Primary,
      size = SizeEnum.md,
      rounded = SizeEnum.md,
      className,
      startIcon,
      endIcon,
      loadingText,
      fullWidth,
      align = "center",
      type = "button",
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    const alignClass = align === "start" ? "justify-start" : align === "end" ? "justify-end" : "justify-center";

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={clsx(
          "inline-flex items-center font-semibold whitespace-nowrap cursor-pointer gap-2",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          variantStyles[variant],
          controlSize[size],
          radiusSize[rounded],
          alignClass,
          fullWidth && "w-full",
          isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className,
        )}
        {...props}>
        {loading ? (
          <span className="flex items-center gap-1.5">
            <GSpinner size={SizeEnum.sm} />
            {loadingText}
          </span>
        ) : (
          <>
            {startIcon && <span className="shrink-0">{startIcon}</span>}
            {children}
            {endIcon && <span className="mr-auto">{endIcon}</span>}
          </>
        )}
      </button>
    );
  },
);

GButton.displayName = "GButton";

export { GButton };
