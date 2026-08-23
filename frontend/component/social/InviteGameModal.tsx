"use client";

import { useState } from "react";

import { GModal } from "@/component/common/GModal";
import { GButton } from "@/component/common/GButton";
import { GButtonAsync } from "@/component/common/GButtonAsync";
import { GIcon } from "@/component/common/GIcon";
import { GamesList, translateGameInfo } from "@/domain/constant/games";
import { gameService } from "@/services/def/GameService";
import { useTranslation } from "@/hooks/useSetting";
import { en, type TSocialPanelTranslation } from "@/component/i18n/SocialPanel/en.i18n";
import { ar } from "@/component/i18n/SocialPanel/ar.i18n";
import { fr } from "@/component/i18n/SocialPanel/fr.i18n";
import { en as GameEn, type GameTranslations } from "@/component/i18n/Game/en.i18n";
import { ar as GameAr } from "@/component/i18n/Game/ar.i18n";
import { fr as GameFr } from "@/component/i18n/Game/fr.i18n";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import type { TNullable } from "@/domain/type/TCommon";

interface IInviteGameModalProps {
  open: boolean;
  onClose: () => void;
  friendId: TNullable<string>;
  friendName: string;
  disabled?: boolean;
}

function InviteGameModal({ open, onClose, friendId, friendName, disabled = false }: IInviteGameModalProps) {
  const t = useTranslation({ en, ar, fr }) as TSocialPanelTranslation;
  const tGame = useTranslation({ en: GameEn, ar: GameAr, fr: GameFr }) as GameTranslations;
  const [feedback, setFeedback] = useState<TNullable<string>>(null);

  const handleInvite = async (gameType: GamesKindEnum) => {
    if (!friendId) return;
    setFeedback(null);
    try {
      await gameService.inviteFriend(friendId, gameType);
      setFeedback(t.inviteSent);
    } catch {
      setFeedback(t.inviteFailed);
    }
  };

  return (
    <GModal open={open} onClose={onClose} ariaLabel={t.invite}>
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-text">{t.inviteTitle.replace("{name}", friendName)}</h2>
        <div className="space-y-2">
          {GamesList.map((game) => (
            <GButtonAsync
              key={game.type}
              variant={ButtonVariantEnum.Secondary}
              className="w-full justify-start"
              onClick={() => handleInvite(game.type)}
              disabled={disabled}>
              <GIcon icon={game.icon} size={SizeEnum.md} color={AccentColorEnum.Secondary} />
              <span>{translateGameInfo(tGame, game.type).name}</span>
            </GButtonAsync>
          ))}
        </div>
        {feedback && <p className="text-sm font-medium text-primary">{feedback}</p>}
        <div className="flex justify-end">
          <GButton variant={ButtonVariantEnum.Subtle} onClick={onClose}>
            {t.cancel}
          </GButton>
        </div>
      </div>
    </GModal>
  );
}

export { InviteGameModal };
