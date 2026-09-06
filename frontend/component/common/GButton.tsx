"use client";

import Link from "next/link";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/cn";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { controlSize, buttonVariantStyles, focusRing, toneClasses } from "@/domain/constant/style-tokens";

import { GSpinner } from "./GSpinner";
import { GTooltip } from "./GTooltip";
import { GIcon } from "./GIcon";

import type { IGButtonProps } from "./def/GButton";

const solidVariants = new Set([ButtonVariantEnum.Primary, ButtonVariantEnum.Danger]);

function GButton({
  children,
  disabled,
  loading,
  href,
  variant = ButtonVariantEnum.Primary,
  size = SizeEnum.md,
  tone,
  icon,
  flip,
  label,
  tooltipSide,
  className,
  startIcon,
  endIcon,
  type = "button",
  tooltipPosition,
  onClick,
  ref,
  ...props
}: IGButtonProps) {
  const [pending, setPending] = useState(false);
  const busy = (loading ?? false) || pending;

  const ariaLabel = label || props["aria-label"];
  const tooltipContent = ariaLabel || props.title;
  const effectiveTooltipSide = tooltipSide ?? tooltipPosition ?? "bottom";

  const restProps = { ...props };
  if (tooltipContent) delete restProps.title;

  const spinnerColor = solidVariants.has(variant) ? "text-on-primary" : "text-primary";

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (busy || !onClick) return;
    const result = onClick(event);
    if (result instanceof Promise) {
      setPending(true);
      result.finally(() => setPending(false));
    }
  };

  const isIconOnly = Boolean(icon) && !children;
  const effectiveVariant = tone ? ButtonVariantEnum.Subtle : variant;
  const effectiveSize = tone ? SizeEnum.None : isIconOnly && size === SizeEnum.md ? SizeEnum.iconSm : size;

  const classes = cn(
    "inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap cursor-pointer rounded-lg transition-colors duration-150",
    focusRing,
    buttonVariantStyles[effectiveVariant],
    controlSize[effectiveSize],
    tone && cn("rounded-lg p-2 border-0", toneClasses[tone]),
    isIconOnly && !tone && "rounded-lg",
    busy && "cursor-progress",
    disabled && "opacity-50 cursor-not-allowed pointer-events-none",
    className,
  );

  const content = busy ? (
    <GSpinner size={SizeEnum.sm} color={spinnerColor} />
  ) : isIconOnly ? (
    <GIcon icon={icon as LucideIcon} size={SizeEnum.md} flip={flip} />
  ) : (
    <>
      {startIcon && <span className="shrink-0">{startIcon}</span>}
      {children}
      {endIcon && <span className="ms-auto">{endIcon}</span>}
    </>
  );

  const buttonEl = href ? (
    <Link
      {...(restProps as Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">)}
      href={href}
      aria-label={ariaLabel}
      aria-disabled={disabled || busy}
      className={classes}
      onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}>
      {content}
    </Link>
  ) : (
    <button ref={ref} type={type} aria-label={ariaLabel} disabled={disabled || busy} aria-busy={busy || undefined} className={classes} onClick={handleClick} {...restProps}>
      {content}
    </button>
  );

  if (tooltipContent) {
    return (
      <GTooltip content={tooltipContent} side={effectiveTooltipSide} className={className?.includes("w-full") ? "w-full" : undefined}>
        {buttonEl}
      </GTooltip>
    );
  }

  return buttonEl;
}

export { GButton, GButton as GIconButton };
