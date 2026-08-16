"use client";

import clsx from "clsx";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { GButton } from "./GButton";
import { GIcon } from "./GIcon";
import type { IGDropdownItemProps } from "./def/GDropdownItem";

function GDropdownItem({ icon: Icon, label, onClick, className, disabled, children }: IGDropdownItemProps) {
  return (
    <GButton
      variant={ButtonVariantEnum.Subtle}
      size={SizeEnum.md}
      disabled={disabled}
      align="start"
      role="menuitem"
      className={clsx("w-full gap-3 justify-start", className)}
      onClick={onClick}>
      {Icon && <GIcon icon={Icon} size={SizeEnum.sm} className="shrink-0" />}
      <span className="min-w-0 flex-1 truncate text-start font-medium">{label}</span>
      {children && <span className="flex shrink-0 items-center">{children}</span>}
    </GButton>
  );
}

export { GDropdownItem };
