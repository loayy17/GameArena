"use client";

import { Play, UserPlus } from "lucide-react";
import { useState, useMemo } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useFriendList } from "@/hooks/useFriends";
import { InviteModal } from "@/component/games/common/InviteModal";
import { GamePlayersHeader } from "@/component/games/common/GamePlayersHeader";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import type { IGameState } from "@/app/providers/def/IGameState";
import type { GameInfo } from "./gameConfig";

interface GameLobbyProps {
  state: IGameState;
  gameInfo: GameInfo;
  t: Record<string, any>;
  onStartVsAI: () => void;
  onInviteFriend: (friendId: string) => void;
  onCancel: () => void;
}

function GameLobby({ state, gameInfo, t, onStartVsAI, onInviteFriend, onCancel }: GameLobbyProps) {
  const { user } = useAuth();
  const { friends, loading: loadingFriends } = useFriendList();

  const [showInvitePicker, setShowInvitePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFriends = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return friends;
    return friends.filter((f) =>
      `${f.firstName ?? ""} ${f.lastName ?? ""} ${f.userName ?? ""}`.toLowerCase().includes(term),
    );
  }, [friends, searchQuery]);

  const handleInviteToRoom = (friendId: string) => {
    onInviteFriend(friendId);
    setShowInvitePicker(false);
  };

  return (
    <div className="flex items-center justify-center min-h-150 p-4">
      <div className="w-full max-w-lg space-y-6">
        <GamePlayersHeader
          player1={{
            id: state.player1Id,
            username: state.player1Username,
            isTurn: false,
            isYou: state.player1Id === user?.id,
          }}
          player2={{ id: undefined, username: undefined, isTurn: false, isYou: false }}
          player1Symbol={gameInfo.symbol1}
          player2Symbol="?"
          isBotGame={false}
          currentUserId={user?.id}
          myName={user?.userName ?? t.game.you}
          player1Fallback={t.game.player1}
          player2Fallback={t.game.waiting}
          vsLabel={t.game.vs}
          youSuffix={t.game.youSuffix}
          aiBotLabel={t.game.aiBot}
          turnLabel={t.game.turn}
          player1Colors={gameInfo.player1Colors}
          player2Colors={gameInfo.player2Colors}
        />

        <p className="text-center text-text-secondary text-sm">{t.waiting.subtitle}</p>

        <div className="flex flex-col gap-3">
          {state.player1Id === user?.id && (
            <>
              <GButton onClick={onStartVsAI} fullWidth leftIcon={<GIcon icon={Play} size="md" color="inherit" />}>
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
          <GButton onClick={onCancel} variant="secondary">
            {t.waiting.cancelMatch}
          </GButton>
        </div>

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
