"use client";

import { Play, UserPlus } from "lucide-react";
import { useState, useEffect, useMemo, useRef, type ReactNode } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useGame } from "@/app/providers/GameProvider";
import { useFriendList } from "@/hooks/useFriends";
import { useTranslation } from "@/hooks/useSetting";
import { en as gameEn, type GameTranslations } from "@/component/i18n/Game/en.i18n";
import { ar as gameAr } from "@/component/i18n/Game/ar.i18n";
import { GameLobby } from "@/component/games/common/GameLobby";
import { InviteModal } from "@/component/games/common/InviteModal";
import { GamePlayersHeader } from "@/component/games/common/GamePlayersHeader";
import { GameTurnIndicator } from "@/component/games/common/GameTurnIndicator";
import { GameResult } from "@/component/games/common/GameResult";
import { GButton } from "@/component/common/GButton";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import type { TNullable } from "@/domain/type/TCommon";

interface GameLayoutProps {
  children: ReactNode;
  gameType: GamesKindEnum;
}

export function GameLayoutWrapper({ children, gameType }: GameLayoutProps) {
  const { user } = useAuth();
  const game = useGame();
  const t = useTranslation({ en: gameEn, ar: gameAr }) as GameTranslations;

  const { state, roomId, isSearching, isConnected, opponentDisconnected, findMatch, startGame, inviteToRoom, leaveGame, resetGame } = game;

  const hasInitiatedMatch = useRef(false);

  useEffect(() => {
    if (!roomId && !isSearching && !hasInitiatedMatch.current) {
      hasInitiatedMatch.current = true;
      findMatch(gameType);
    }
  }, [roomId, isSearching, findMatch, gameType]);

  const isBotGame = state?.isBotGame ?? false;
  const myName = user?.userName || t.game.you;

  const [showInvitePicker, setShowInvitePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { friends, loading: loadingFriends } = useFriendList();

  const gameInfo = useMemo(() => {
    switch (gameType) {
      case GamesKindEnum.TicTacToe:
        return { name: t.tictactoe.name, description: t.tictactoe.description, symbol1: "X", symbol2: "O" };
      case GamesKindEnum.Snake:
        return { name: t.snake.name, description: t.snake.description, symbol1: "P1", symbol2: "P2" };
      case GamesKindEnum.PingPong:
        return { name: t.pingpong.name, description: t.pingpong.description, symbol1: "P1", symbol2: "P2" };
      default:
        return { name: "", description: "", symbol1: "P1", symbol2: "P2" };
    }
  }, [gameType, t]);

  const filteredFriends = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return friends;
    return friends.filter((f) => `${f.firstName ?? ""} ${f.lastName ?? ""} ${f.userName ?? ""}`.toLowerCase().includes(term));
  }, [friends, searchQuery]);

  const startGameNew = (friendId: TNullable<string> = null) => {
    if (!state || user?.id !== state.player1Id) return;
    startGame(friendId ?? state.player2Id ?? null, gameType);
  };

  const opponentName = isBotGame
    ? t.game.aiBot
    : state?.player1Id === user?.id
      ? state?.player2Username || t.game.opponent
      : state?.player1Username || t.game.opponent;

  const handleInviteToRoom = (friendId: string) => {
    inviteToRoom(friendId);
    setShowInvitePicker(false);
  };

  // STAGE 1: Lobby
  if (!roomId) {
    return (
      <div className="flex items-center justify-center min-h-150 p-4">
        <GameLobby
          isSearching={isSearching}
          isConnected={isConnected}
          findMatch={() => findMatch(gameType)}
          resetGame={resetGame}
          t={{
            title: gameInfo.name,
            subtitle: gameInfo.description,
            findMatch: t.lobby.findMatch,
            connecting: t.lobby.connecting,
            tabs: { quick: t.lobby.quick, invite: t.lobby.invite },
            searchFriends: t.waiting.searchFriends,
            noFriendsFound: t.waiting.noFriendsFound,
            searchingTitle: t.lobby.searchingTitle,
            searchingSubtitle: t.lobby.searchingSubtitle,
            cancelSearch: t.lobby.cancelSearch,
          }}
        />
      </div>
    );
  }

  // STAGE 2: Waiting for opponent
  if (roomId && !state?.player2Id) {
    return (
      <div className="flex items-center justify-center min-h-150 p-4">
        <div className="w-full max-w-lg space-y-6">
          <GamePlayersHeader
            player1={{
              id: state!.player1Id,
              username: state!.player1Username,
              isTurn: false,
              isYou: state!.player1Id === user?.id,
            }}
            player2={{
              id: undefined,
              username: undefined,
              isTurn: false,
              isYou: false,
            }}
            player1Symbol={gameInfo.symbol1}
            player2Symbol="?"
            isBotGame={false}
            currentUserId={user?.id}
            myName={myName}
            player1Fallback={t.game.player1}
            player2Fallback={t.game.waiting}
            vsLabel={t.game.vs}
            youSuffix={t.game.youSuffix}
            aiBotLabel={t.game.aiBot}
            turnLabel={t.game.turn}
          />

          <p className="text-center text-text-secondary text-sm">{t.waiting.subtitle}</p>

          <div className="flex flex-col gap-3">
            {state?.player1Id === user?.id && (
              <>
                <GButton onClick={() => startGameNew(null)} fullWidth leftIcon={<Play className="w-5 h-5" />}>
                  {t.waiting.startVsAI}
                </GButton>
                <GButton onClick={() => setShowInvitePicker(true)} fullWidth variant="secondary" leftIcon={<UserPlus className="w-5 h-5" />}>
                  {t.waiting.inviteFriend}
                </GButton>
              </>
            )}
            <GButton onClick={resetGame} variant="secondary">
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

  // STAGE 3: Opponent found
  if (roomId && state?.player2Id && !state.hasStarted) {
    const isHost = user?.id === state.player1Id;
    return (
      <div className="flex items-center justify-center min-h-150 p-4">
        <div className="w-full max-w-lg bg-bg-card border border-border rounded-lg p-8 text-center relative">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-primary" />
          <h2 className="text-2xl font-black text-text mb-6">{t.ready.title}</h2>

          <div className="flex items-center justify-center gap-6 mb-10">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-md flex items-center justify-center border-2 border-accent bg-accent-muted">
                <span className="text-3xl font-bold text-accent">{gameInfo.symbol1}</span>
              </div>
              <span className="text-sm font-bold mt-3 text-text truncate max-w-28">
                {state.player1Id === user?.id ? t.game.you : state.player1Username}
              </span>
            </div>

            <div className="text-text-muted font-black italic text-xl">{t.game.vs}</div>

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-md flex items-center justify-center border-2 border-warning bg-warning-bg">
                <span className="text-3xl font-bold text-warning">{gameInfo.symbol2}</span>
              </div>
              <span className="text-sm font-bold mt-3 text-text truncate max-w-28">
                {state.player2Id === user?.id ? t.game.you : state.player2Username}
              </span>
            </div>
          </div>

          <GButton
            disabled={!isHost}
            onClick={() => startGameNew(state.player2Id!)}
            fullWidth
            size="lg"
            leftIcon={<Play className="w-6 h-6 fill-current" />}>
            {isHost ? t.ready.startGame : t.ready.waitingForStart}
          </GButton>
        </div>
      </div>
    );
  }

  // STAGE 4: Match started - render game board
  if (roomId && state?.hasStarted) {
    const player1IsTurn = state.currentTurnPlayerId === state.player1Id && !state.isFinished;
    const player2IsTurn = state.currentTurnPlayerId === state.player2Id && !state.isFinished;
    const isMyTurn = state.currentTurnPlayerId === user?.id;

    return (
      <div className="flex items-center justify-center min-h-150 p-4">
        <div className="w-full max-w-lg space-y-6">
          <GamePlayersHeader
            player1={{
              id: state.player1Id,
              username: state.player1Username,
              isTurn: player1IsTurn,
              isYou: state.player1Id === user?.id,
            }}
            player2={{
              id: state.player2Id,
              username: state.player2Username,
              isTurn: player2IsTurn,
              isYou: state.player2Id === user?.id,
            }}
            player1Symbol={gameInfo.symbol1}
            player2Symbol={gameInfo.symbol2}
            isBotGame={isBotGame}
            currentUserId={user?.id}
            myName={myName}
            player1Fallback={t.game.player1}
            player2Fallback={t.game.player2}
            vsLabel={t.game.vs}
            youSuffix={t.game.youSuffix}
            aiBotLabel={t.game.aiBot}
            turnLabel={t.game.turn}
          />

          {!state.isFinished && (
            <GameTurnIndicator
              isMyTurn={isMyTurn}
              currentTurnText={t.game.yourTurn}
              waitingText={t.game.waitingFor.replace("{name}", opponentName)}
            />
          )}

          <div className="relative">
            {children}

            <GameResult
              winnerPlayerId={state.winnerPlayerId}
              isFinished={state.isFinished}
              userId={user?.id}
              opponentDisconnected={opponentDisconnected}
              t={{
                opponentForfeited: t.result.opponentForfeited,
                opponentForfeitedDesc: t.result.opponentForfeitedDesc,
                victory: t.result.victory,
                victoryDesc: t.result.victoryDesc,
                draw: t.result.draw,
                drawDesc: t.result.drawDesc,
                defeat: t.result.defeat,
                defeatDesc: t.result.defeatDesc,
              }}
              endT={{
                playAgain: t.result.playAgain,
                lobby: t.result.backToLobby,
              }}
              onPlayAgain={() => findMatch(gameType)}
              onLobby={resetGame}
            />
          </div>

          {!state.isFinished && (
            <div className="flex justify-center">
              <GButton onClick={leaveGame} variant="dangerOutline" size="sm">
                {t.game.leaveGame}
              </GButton>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
