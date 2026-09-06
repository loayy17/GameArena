"use client";

import { useEffect, useState } from "react";

import { GAlert } from "@/component/common/GAlert";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { GModal } from "@/component/common/GModal";
import { useTranslation } from "@/hooks/useSetting";
import { useGameTranslation } from "@/hooks/useGameTranslation";
import { gameService } from "@/services/def/GameService";
import { GamesList, translateGameInfo } from "@/domain/constant/games";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";

import { ar } from "@/app/(dashboard)/messages/i18n/ar.i18n";
import { fr } from "@/app/(dashboard)/messages/i18n/fr.i18n";
import { en } from "@/app/(dashboard)/messages/i18n/en.i18n";

import type { TMessagesTranslation } from "@/app/(dashboard)/messages/i18n/en.i18n";
import type { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import type { TNullable } from "@/domain/type/TCommon";
import type { IGameInviteModalProps } from "./def/GameInviteModal";

function GameInviteModal({ open, friendId, friendName, onClose }: IGameInviteModalProps) {
  const t = useTranslation<TMessagesTranslation>({ en, ar, fr });
  const gameT = useGameTranslation();
  const [pendingType, setPendingType] = useState<TNullable<GamesKindEnum>>(null);
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!sent) return;
    const id = window.setTimeout(onClose, 1200);
    return () => window.clearTimeout(id);
  }, [sent, onClose]);

  const handleInvite = async (gameType: GamesKindEnum) => {
    setPendingType(gameType);
    setFailed(false);
    try {
      await gameService.inviteFriend(friendId, gameType);
      setSent(true);
    } catch {
      setFailed(true);
    } finally {
      setPendingType(null);
    }
  };

  return (
    <GModal open={open} onClose={onClose} side="center" size={SizeEnum.sm} ariaLabel={t.inviteTitle.replace("{name}", friendName)}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">{t.inviteTitle.replace("{name}", friendName)}</h3>
        <GButton onClick={onClose} variant={ButtonVariantEnum.Subtle} size={SizeEnum.sm}>
          {t.inviteCancel}
        </GButton>
      </div>
      {failed && <GAlert severity={AccentColorEnum.Danger} className="mb-3">{t.inviteFailed}</GAlert>}
      {sent && <GAlert severity={AccentColorEnum.Success} className="mb-3">{t.inviteSent}</GAlert>}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {GamesList.map((game) => (
          <GButton
            key={game.id}
            variant={ButtonVariantEnum.Secondary}
            loading={pendingType === game.type}
            disabled={pendingType !== null || sent}
            startIcon={<GIcon icon={game.icon} size={SizeEnum.sm} />}
            onClick={() => void handleInvite(game.type)}>
            {translateGameInfo(gameT, game.type).name}
          </GButton>
        ))}
      </div>
    </GModal>
  );
}

export { GameInviteModal };
