"use client";

import { cn } from "@/lib/cn";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";

import { GButton } from "./GButton";
import { GIcon } from "./GIcon";

import type { IGMenuItemProps } from "./def/GMenuItem";

function GMenuItem({ label, icon, onClick, disabled = false, variant = ButtonVariantEnum.Subtle, children, className }: IGMenuItemProps) {
  return (
    <GButton
      role="menuitem"
      variant={variant}
      size={SizeEnum.md}
      disabled={disabled}
      onClick={onClick}
      className={cn("w-full justify-start gap-3 rounded-md font-medium", className)}>
      {icon && <GIcon icon={icon} size={SizeEnum.md} />}
      <span className="min-w-0 flex-1 truncate text-start">{label}</span>
      {children && <span className="flex shrink-0 items-center">{children}</span>}
    </GButton>
  );
}

export { GMenuItem };
