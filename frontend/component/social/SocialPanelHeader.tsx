"use client";

import { Users, X } from "lucide-react";
import { GIcon } from "@/component/common/GIcon";
import { GButton } from "@/component/common/GButton";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";

import type { ISocialPanelHeaderProps } from "./def/SocialPanelHeader";

function SocialPanelHeader({ title, onlineCount, onlineLabel, onClose, showClose = false }: ISocialPanelHeaderProps) {
  return (
    <div className="flex items-center gap-3 px-3 pt-4 pb-2">
      <div className="flex items-center justify-center size-9 rounded-lg bg-primary/15 shrink-0">
        <GIcon icon={Users} size={SizeEnum.sm} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-text truncate">{title}</p>
        {onlineCount !== undefined && onlineLabel && (
          <p className="text-xs text-text-muted">
            <span className="inline-block size-1.5 rounded-full bg-success me-1.5" />
            {onlineCount} {onlineLabel}
          </p>
        )}
      </div>
      {showClose && onClose && (
        <GButton variant={ButtonVariantEnum.Subtle} size={SizeEnum.icon} onClick={onClose} aria-label="Close" className="size-8">
          <GIcon icon={X} size={SizeEnum.sm} />
        </GButton>
      )}
    </div>
  );
}

export { SocialPanelHeader };
