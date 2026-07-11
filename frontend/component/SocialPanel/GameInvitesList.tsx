"use client";

import { useRouter } from "next/navigation";
import { useDashboardNotifications } from "@/app/providers/DashboardNotificationsProvider";
import { GButton } from "@/component/common/GButton";
import { GCard } from "@/component/common/GCard";
import { useTranslation } from "@/hooks/useSetting";
import { GamesList } from "@/domain/constant/games";
import { en, type TSocialPanelTranslation } from "@/component/i18n/SocialPanel/en.i18n";
import { ar } from "@/component/i18n/SocialPanel/ar.i18n";
import type { IGameInvitesListProps } from "./def/GameInvitesList";

const gamePath = (gameType: number) => GamesList.find((g) => g.type === gameType)?.path ?? "tic-tac-toe";

export function GameInvitesList({ onAfterAccept }: IGameInvitesListProps) {
  const router = useRouter();
  const t = useTranslation({ en, ar }) as TSocialPanelTranslation;
  const { gameInvites, acceptGameInvite, dismissGameInvite } = useDashboardNotifications();

  if (!gameInvites.length) return null;

  return (
    <div className="space-y-2">
      {gameInvites.map((invite) => (
        <GCard key={invite.roomId} padding="sm" className="bg-primary-muted border-primary/20">
          <p className="text-sm font-medium text-text">{t.invites.wantsToPlay.replace("{{name}}", invite.inviterName ?? "")}</p>

          <div className="flex gap-2 mt-2">
            <GButton
              size="sm"
              onClick={async () => {
                await acceptGameInvite(invite.roomId);
                router.push(`/games/${gamePath(invite.gameType)}`);
                onAfterAccept?.();
              }}>
              {t.invites.accept}
            </GButton>

            <GButton size="sm" variant="secondary" onClick={() => dismissGameInvite(invite.roomId)}>
              {t.invites.decline}
            </GButton>
          </div>
        </GCard>
      ))}
    </div>
  );
}
