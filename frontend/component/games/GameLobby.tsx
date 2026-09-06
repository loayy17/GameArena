"use client";

import { useMemo, useState } from "react";
import { Play, UserPlus, X } from "lucide-react";

import { useAuth } from "@/app/providers/AuthProvider";
import { useGame } from "@/app/providers/GameProvider";
import { GButton } from "@/component/common/GButton";
import { GCard } from "@/component/common/GCard";
import { GConfirmDialog } from "@/component/common/GConfirmDialog";
import { GIcon } from "@/component/common/GIcon";
import { InviteModal } from "@/component/games/common/InviteModal";
import { translateGameInfo } from "@/domain/constant/games";
import { filterUsersByTerm } from "@/domain/lib/userUtils";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { useDashboardData } from "@/app/providers/DashboardDataProvider";
import { useGameTranslation } from "@/hooks/useGameTranslation";

import { GamePlayersHeader } from "./GameUI";

import type { TNullable } from "@/domain/type/TCommon";
import type { IGameLobbyProps } from "./def/GameLobby";

function GameLobby({ gameType }: IGameLobbyProps) {
  const { user } = useAuth();
  const { state, startGame, inviteToRoom, resetGame } = useGame();
  const t = useGameTranslation();
  const { friends, loading: loadingFriends } = useDashboardData();
  const { name: gameName, description: gameDescription } = translateGameInfo(t, gameType);

  const [showInvitePicker, setShowInvitePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [invitingId, setInvitingId] = useState<TNullable<string>>(null);

  const filteredFriends = useMemo(() => filterUsersByTerm(friends, searchQuery), [friends, searchQuery]);

  if (!state) return null;

  const handleStartVsAI = () => startGame(null, gameType);

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

        <GCard className="text-center p-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="relative flex size-3">
              <span className="relative inline-flex rounded-full size-3 bg-primary" />
            </span>
            <p className="text-text-secondary text-sm">{t.waiting.subtitle}</p>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            {state.player1Id === user?.id && (
              <>
                <GButton
                  className="w-full"
                  onClick={() => handleStartVsAI()}
                  startIcon={<GIcon icon={Play} size={SizeEnum.md} />}>
                  {t.waiting.startVsAI}
                </GButton>
                <GButton
                  className="w-full"
                  onClick={() => setShowInvitePicker(true)}
                  variant={ButtonVariantEnum.Secondary}
                  startIcon={<GIcon icon={UserPlus} size={SizeEnum.md} />}>
                  {t.waiting.inviteFriend}
                </GButton>
              </>
            )}
            <GButton
              onClick={() => setConfirmCancel(true)}
              variant={ButtonVariantEnum.Secondary}
              size={SizeEnum.sm}
              startIcon={<GIcon icon={X} size={SizeEnum.md} />}>
              {t.waiting.cancelMatch}
            </GButton>
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

        <GConfirmDialog
          open={confirmCancel}
          icon={X}
          title={t.waiting.cancelTitle}
          description={t.waiting.cancelDescription}
          confirmLabel={t.waiting.cancelConfirm}
          cancelLabel={t.waiting.cancelStay}
          onConfirm={() => {
            setConfirmCancel(false);
            resetGame();
          }}
          onClose={() => setConfirmCancel(false)}
        />
      </div>
    </div>
  );
}

export { GameLobby };
