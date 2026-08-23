"use client";

import { cn } from "@/lib/cn";
import { forwardRef } from "react";
import type { IGButtonProps } from "./def/GButton";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { controlSize, radiusSize } from "@/domain/constant/size-classes";
import { buttonVariantStyles } from "@/domain/constant/button-styles";
import { GTooltip } from "./GTooltip";

const GButton = forwardRef<HTMLButtonElement, IGButtonProps>(
  (
    {
      children,
      disabled,
      variant = ButtonVariantEnum.Primary,
      size = SizeEnum.md,
      rounded = SizeEnum.md,
      className,
      startIcon,
      endIcon,
      fullWidth,
      align = "center",
      type = "button",
      ...props
    },
    ref,
  ) => {
    const alignClass = align === "start" ? "justify-start" : align === "end" ? "justify-end" : "justify-center";
    const ariaLabel = (props as Record<string, unknown>)["aria-label"] as string | undefined;
    const title = (props as Record<string, unknown>).title as string | undefined;
    const tooltipContent = ariaLabel || title;
    const isIcon = size === SizeEnum.icon || size === SizeEnum.iconSm;
    const shouldTooltip = Boolean(tooltipContent) && isIcon;
    const { title: _title, ...restProps } = props as Record<string, unknown>;

    const buttonEl = (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          "transition-all active:scale-[0.98]",
          buttonVariantStyles[variant],
          controlSize[size],
          radiusSize[rounded],
          alignClass,
          fullWidth && "w-full",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className,
        )}
        {...((shouldTooltip ? restProps : props) as typeof props)}>
        {startIcon && <span className="shrink-0">{startIcon}</span>}
        {children}
        {endIcon && <span className="ms-auto">{endIcon}</span>}
      </button>
    );

    if (shouldTooltip && tooltipContent) {
      return (
        <GTooltip content={tooltipContent} side="bottom">
          {buttonEl}
        </GTooltip>
      );
    }

    return buttonEl;
  },
);

GButton.displayName = "GButton";

export { GButton };
