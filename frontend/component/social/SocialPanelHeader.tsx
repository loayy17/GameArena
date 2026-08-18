"use client";

import { Users, X } from "lucide-react";
import { GIcon } from "@/component/common/GIcon";
import { GButton } from "@/component/common/GButton";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";

import type { ISocialPanelHeaderProps } from "./def/SocialPanelHeader";

function SocialPanelHeader({ title, onlineCount, onlineLabel, onClose, showClose = false }: ISocialPanelHeaderProps) {
  return (
    <div className="flex items-center gap-3 px-4 pt-4 pb-2">
      <div className="flex-1 min-w-0">
        <p className="font-bold text-text flex items-center gap-2">
          <GIcon icon={Users} size={SizeEnum.sm} className="shrink-0" />
          <span className="truncate">{title}</span>
        </p>
        {onlineCount !== undefined && onlineLabel && (
          <p className="text-xs text-text-muted">
            {onlineCount} {onlineLabel}
          </p>
        )}
      </div>
      {showClose && onClose && (
        <GButton variant={ButtonVariantEnum.Subtle} size={SizeEnum.icon} onClick={onClose} aria-label="Close" className="w-8 h-8">
          <GIcon icon={X} size={SizeEnum.sm} />
        </GButton>
      )}
    </div>
  );
}

export { SocialPanelHeader };
