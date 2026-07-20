"use client";

import { Play, UserPlus } from "lucide-react";
import { useState, useMemo } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useGame } from "@/app/providers/GameProvider";
import { useGameTranslation } from "@/hooks/useGameTranslation";
import { useFriendList } from "@/hooks/useFriends";
import { GamePlayersHeader } from "@/component/games/common/GamePlayersHeader";
import { InviteModal } from "@/component/games/common/InviteModal";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { GCard } from "@/component/common/GCard";
import type { GamesKindEnum } from "@/domain/enum/GamesKindEnum";

interface GameLobbyProps {
  gameType: GamesKindEnum;
}

function GameLobby({ gameType }: GameLobbyProps) {
  const { user } = useAuth();
  const { state, startGame, inviteToRoom, resetGame } = useGame();
  const t = useGameTranslation();
  const { friends, loading: loadingFriends } = useFriendList();

  const [showInvitePicker, setShowInvitePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFriends = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return friends;
    return friends.filter((f) => `${f.firstName ?? ""} ${f.lastName ?? ""} ${f.userName ?? ""}`.toLowerCase().includes(term));
  }, [friends, searchQuery]);

  if (!state) return null;

  const handleInviteToRoom = (friendId: string) => {
    inviteToRoom(friendId);
    setShowInvitePicker(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[150px] p-4">
      <div className="w-full max-w-lg space-y-6">
        <GamePlayersHeader gameType={gameType} />

        <GCard padding="md" className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
            </span>
            <p className="text-text-secondary text-sm">{t.waiting.subtitle}</p>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            {state.player1Id === user?.id && (
              <>
                <GButton onClick={() => startGame(null, gameType)} fullWidth leftIcon={<GIcon icon={Play} size="md" color="inherit" />}>
                  {t.waiting.startVsAI}
                </GButton>
                <GButton
                  onClick={() => setShowInvitePicker(true)}
                  fullWidth
                  variant="secondary"
                  leftIcon={<GIcon icon={UserPlus} size="md" color="inherit" />}>
                  {t.waiting.inviteFriend}
                </GButton>
              </>
            )}
            <GButton onClick={() => resetGame()} variant="secondary">
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
        />
      </div>
    </div>
  );
}

export { GameLobby };
