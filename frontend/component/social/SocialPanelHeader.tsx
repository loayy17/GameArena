"use client";

import { Users, X } from "lucide-react";

import { GIcon } from "@/component/common/GIcon";
import { GButton } from "@/component/common/GButton";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { useTranslation } from "@/hooks/useSetting";
import { en } from "@/component/i18n/SocialPanel/en.i18n";
import { ar } from "@/component/i18n/SocialPanel/ar.i18n";
import { fr } from "@/component/i18n/SocialPanel/fr.i18n";

import type { TSocialPanelTranslation } from "@/component/i18n/SocialPanel/en.i18n";
import type { ISocialPanelHeaderProps } from "./def/SocialPanelHeader";

function SocialPanelHeader({ title, onlineCount, onlineLabel, onClose, showClose = false }: ISocialPanelHeaderProps) {
  const t = useTranslation<TSocialPanelTranslation>({ en, ar, fr });

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
        <GButton icon={X} label={t.close} variant={ButtonVariantEnum.Subtle} size={SizeEnum.icon} onClick={onClose} className="size-8 overflow-visible" />
      )}
    </div>
  );
}

export { SocialPanelHeader };
