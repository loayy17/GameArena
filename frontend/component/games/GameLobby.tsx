"use client";

import { useMemo, useState } from "react";
import { Play, UserPlus, X } from "lucide-react";

import { useAuth } from "@/app/providers/AuthProvider";
import { useGame } from "@/app/providers/GameProvider";
import { GButton } from "@/component/common/GButton";
import { GButtonAsync } from "@/component/common/GButtonAsync";
import { GCard } from "@/component/common/GCard";
import { GIcon } from "@/component/common/GIcon";
import { InviteModal } from "@/component/games/common/InviteModal";
import { translateGameInfo } from "@/domain/constant/games";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { useDashboardData } from "@/app/providers/DashboardDataProvider";
import { useGameTranslation } from "@/hooks/useGameTranslation";
import type { TNullable } from "@/domain/type/TCommon";

import { GamePlayersHeader } from "./GameUI";
import type { IGameLobbyProps } from "./def/GameLobby";

function GameLobby({ gameType }: IGameLobbyProps) {
  const { user } = useAuth();
  const { state, startGame, inviteToRoom, resetGame } = useGame();
  const t = useGameTranslation();
  const { friends, loading: loadingFriends } = useDashboardData();
  const { name: gameName, description: gameDescription } = translateGameInfo(t, gameType);

  const [showInvitePicker, setShowInvitePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [starting, setStarting] = useState(false);
  const [invitingId, setInvitingId] = useState<TNullable<string>>(null);

  const filteredFriends = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return friends;
    return friends.filter((f) => `${f.firstName ?? ""} ${f.lastName ?? ""} ${f.userName ?? ""}`.toLowerCase().includes(term));
  }, [friends, searchQuery]);

  if (!state) return null;

  const handleStartVsAI = async () => {
    setStarting(true);
    try {
      await startGame(null, gameType);
    } finally {
      setStarting(false);
    }
  };

  const handleInviteToRoom = async (friendId: string) => {
    setInvitingId(friendId);
    try {
      await inviteToRoom(friendId);
      setShowInvitePicker(false);
    } finally {
      setInvitingId(null);
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-text">{gameName}</h1>
          <p className="text-text-secondary text-sm">{gameDescription}</p>
        </div>

        <GamePlayersHeader gameType={gameType} />

        <GCard padding={SizeEnum.md} className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="relative flex size-3">
              <span className="relative inline-flex rounded-full size-3 bg-primary" />
            </span>
            <p className="text-text-secondary text-sm">{t.waiting.subtitle}</p>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            {state.player1Id === user?.id && (
              <>
                <GButtonAsync onClick={() => void handleStartVsAI()} fullWidth busy={starting} startIcon={<GIcon icon={Play} size={SizeEnum.md} />}>
                  {t.waiting.startVsAI}
                </GButtonAsync>
                <GButton
                  onClick={() => setShowInvitePicker(true)}
                  fullWidth
                  variant={ButtonVariantEnum.Secondary}
                  startIcon={<GIcon icon={UserPlus} size={SizeEnum.md} />}>
                  {t.waiting.inviteFriend}
                </GButton>
              </>
            )}
            <GButtonAsync
              onClick={() => resetGame()}
              variant={ButtonVariantEnum.Secondary}
              size={SizeEnum.sm}
              startIcon={<GIcon icon={X} size={SizeEnum.md} />}>
              {t.waiting.cancelMatch}
            </GButtonAsync>
          </div>
        </GCard>

        <InviteModal
          open={showInvitePicker}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          loading={loadingFriends}
          friends={filteredFriends}
          onSelect={handleInviteToRoom}
          onClose={() => setShowInvitePicker(false)}
          title={t.invite.title}
          cancelLabel={t.invite.cancel}
          searchPlaceholder={t.invite.searchFriends}
          noFriendsText={t.invite.noFriends}
          pendingId={invitingId}
        />
      </div>
    </div>
  );
}

export { GameLobby };
