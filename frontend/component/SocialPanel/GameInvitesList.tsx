"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboardNotifications } from "@/app/providers/DashboardNotificationsProvider";
import { useGame } from "@/app/providers/GameProvider";
import { GButton } from "@/component/common/GButton";
import { GCard } from "@/component/common/GCard";
import { GModal } from "@/component/common/GModal";
import { useTranslation } from "@/hooks/useSetting";
import { GamesList } from "@/domain/constant/games";
import { en, type TSocialPanelTranslation } from "@/component/i18n/SocialPanel/en.i18n";
import { ar } from "@/component/i18n/SocialPanel/ar.i18n";
import type { IGameInvitesListProps } from "./def/GameInvitesList";
import { GEmpty } from "../common/GEmpty";
import { Bell } from "lucide-react";
import { GIcon } from "../common/GIcon";

const gamePath = (gameType: number) => GamesList.find((g) => g.type === gameType)?.path ?? "tic-tac-toe";

export function GameInvitesList({ onAfterAccept }: IGameInvitesListProps) {
  const router = useRouter();
  const t = useTranslation({ en, ar }) as TSocialPanelTranslation;
  const { gameInvites, acceptGameInvite, dismissGameInvite } = useDashboardNotifications();
  const { state, leaveGame } = useGame();
  const [pendingAccept, setPendingAccept] = useState<{ roomId: string; path: string } | null>(null);

  const isInGame = state !== null;

  const handleAccept = async (roomId: string, path: string) => {
    if (isInGame) {
      setPendingAccept({ roomId, path });
      return;
    }
    await acceptGameInvite(roomId);
    router.push(`/games/${path}`);
    onAfterAccept?.();
  };

  const handleConfirmAccept = async () => {
    if (!pendingAccept) return;
    await leaveGame();
    await acceptGameInvite(pendingAccept.roomId);
    router.push(`/games/${pendingAccept.path}`);
    setPendingAccept(null);
    onAfterAccept?.();
  };

  const handleCancelAccept = () => setPendingAccept(null);

  if (!gameInvites.length)
    return <GEmpty icon={<GIcon icon={Bell} size="xl" color="muted" />} title={t.noInvitesTitle} description={t.noInvitesDescription} />;

  return (
    <div className="space-y-2">
      {gameInvites.map((invite) => (
        <GCard key={invite.roomId} padding="sm" className="bg-primary-muted border-primary/20">
          <p className="text-sm font-medium text-text">{t.invites.wantsToPlay.replace("{{name}}", invite.inviterName ?? "")}</p>
          <div className="flex gap-2 mt-2">
            <GButton size="sm" onClick={() => handleAccept(invite.roomId, gamePath(invite.gameType))}>
              {t.invites.accept}
            </GButton>
            <GButton size="sm" variant="secondary" onClick={() => dismissGameInvite(invite.roomId)}>
              {t.invites.decline}
            </GButton>
          </div>
        </GCard>
      ))}

      <GModal open={pendingAccept !== null} onClose={handleCancelAccept} role="alertdialog" ariaLabel="Accept invite confirmation">
        <div className="text-center">
          <h2 className="text-xl font-bold text-text mb-2">{t.leaveTitle}</h2>
          <p className="text-sm text-text-secondary mb-6">{t.leaveDesc}</p>
          <div className="flex gap-3">
            <GButton onClick={handleCancelAccept} variant="secondary" fullWidth>
              {t.cancel}
            </GButton>
            <GButton onClick={handleConfirmAccept} variant="danger" fullWidth>
              {t.leaveAccept}
            </GButton>
          </div>
        </div>
      </GModal>
    </div>
  );
}
