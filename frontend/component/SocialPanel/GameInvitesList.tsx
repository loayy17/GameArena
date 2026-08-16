"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboardData } from "@/app/providers/DashboardDataProvider";
import { useGame } from "@/app/providers/GameProvider";
import { GButton } from "@/component/common/GButton";
import { GCard } from "@/component/common/GCard";
import { GList } from "@/component/common/GList";
import { GModal } from "@/component/common/GModal";
import { useTranslation } from "@/hooks/useSetting";
import { GamesList } from "@/domain/constant/games";
import { en, type TSocialPanelTranslation } from "@/component/i18n/SocialPanel/en.i18n";
import { ar } from "@/component/i18n/SocialPanel/ar.i18n";
import { fr } from "@/component/i18n/SocialPanel/fr.i18n";
import { GEmpty } from "../common/GEmpty";
import { Bell } from "lucide-react";
import { GIcon } from "../common/GIcon";
import type { IGameInvitesListProps } from "./def/GameInvitesList";
import type { TNullable, TOptional } from "@/domain/type/TCommon";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";

const gamePath = (gameType: number) => GamesList.find((g) => g.type === gameType)?.path;

export function GameInvitesList({ onAfterAccept }: IGameInvitesListProps) {
  const router = useRouter();
  const t = useTranslation({ en, ar, fr }) as TSocialPanelTranslation;
  const { gameInvites, acceptGameInvite, dismissGameInvite } = useDashboardData();
  const { state, leaveGame } = useGame();
  const [pendingAccept, setPendingAccept] = useState<TNullable<{ roomId: string; path: TOptional<string> }>>(null);

  const isInGame = state !== null;

  const handleAccept = async (roomId: string, path: TOptional<string>) => {
    if (!path) return;
    if (isInGame) {
      setPendingAccept({ roomId, path });
      return;
    }
    await acceptGameInvite(roomId);
    router.push(`/games/${path}`);
    onAfterAccept?.();
  };

  const handleConfirmAccept = async () => {
    if (!pendingAccept?.path) return;
    await leaveGame();
    await acceptGameInvite(pendingAccept.roomId);
    router.push(`/games/${pendingAccept.path}`);
    setPendingAccept(null);
    onAfterAccept?.();
  };

  const handleCancelAccept = () => setPendingAccept(null);

  if (!gameInvites.length)
    return (
      <GEmpty
        icon={<GIcon icon={Bell} size={SizeEnum.xl} color={AccentColorEnum.Muted} />}
        title={t.noInvitesTitle}
        description={t.noInvitesDescription}
      />
    );

  return (
    <div className="space-y-2">
      <GList items={gameInvites} keyExtractor={(invite) => invite.roomId} pageSize={10} listClassName="gap-3">
        {(invite) => (
          <GCard key={invite.roomId} padding={SizeEnum.sm} className="bg-primary-muted border-primary/20">
            <p className="text-sm font-medium text-text">{t.invites.wantsToPlay.replace("{{name}}", invite.inviterName ?? "")}</p>
            <div className="flex gap-2 mt-2">
              <GButton size={SizeEnum.md} onClick={() => handleAccept(invite.roomId, gamePath(invite.gameType))}>
                {t.invites.accept}
              </GButton>
              <GButton size={SizeEnum.md} variant={ButtonVariantEnum.Secondary} onClick={() => dismissGameInvite(invite.roomId)}>
                {t.invites.decline}
              </GButton>
            </div>
          </GCard>
        )}
      </GList>

      <GModal open={pendingAccept !== null} onClose={handleCancelAccept} role="alertdialog" ariaLabel={t.acceptInviteConfirmation}>
        <div className="text-center">
          <h2 className="text-xl font-bold text-text mb-2">{t.leaveTitle}</h2>
          <p className="text-sm text-text-secondary mb-6">{t.leaveDesc}</p>
          <div className="flex gap-3">
            <GButton onClick={handleCancelAccept} variant={ButtonVariantEnum.Secondary} fullWidth>
              {t.cancel}
            </GButton>
            <GButton onClick={handleConfirmAccept} variant={ButtonVariantEnum.Danger} fullWidth>
              {t.leaveAccept}
            </GButton>
          </div>
        </div>
      </GModal>
    </div>
  );
}
