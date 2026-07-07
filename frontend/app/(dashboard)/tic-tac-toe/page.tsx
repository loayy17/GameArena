"use client";

import { useTicTacToe } from "@/hooks/useTicTacToe";
import { useAuth } from "@/app/providers/AuthProvider";
import { GButton } from "@/component/common/GButton";
import { GSpinner } from "@/component/common/GSpinner";
import { GTabs } from "@/component/common/GTabs";
import { GTabItem } from "@/component/common/def/GTabs";
import { GInputSearch } from "@/component/common/GInputSearch";
import { friendService } from "@/services/def/FriendService";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { useTranslation } from "@/hooks/useSetting";
import { en, type TicTacToeTranslations } from "./i18n/en.i18n";
import { ar } from "./i18n/ar.i18n";
import {
  Swords,
  Trophy,
  Frown,
  Handshake,
  User,
  Home,
  Sparkles,
  Zap,
  Play,
  UserPlus,
  Bot,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import type { IFriend } from "@/domain/meta/ICommon";
import type { IApiResponse } from "@/domain/meta/IApiResponse";
import type { IUser } from "@/domain/meta/IUser";
import { FriendsList } from "@/component/SocialPanel/FriendsList";
import { ttt } from "@/component/games/tic-tac-toe/ttt.styles";

type LobbyTab = "quick" | "invite";

function TicTacToePage() {
  const { user } = useAuth();
  const t = useTranslation({ en, ar }) as TicTacToeTranslations;
  const {
    board,
    gameState,
    roomId,
    isSearching,
    isConnected,
    opponentDisconnected,
    isBotGame,
    isMyTurn,
    mySymbol,
    findMatch,
    inviteFriend,
    inviteToRoom,
    makeMove,
    resetGame,
    startGame,
    leaveGame,
  } = useTicTacToe();

  const [lobbyTab, setLobbyTab] = useState<LobbyTab>("quick");
  const [, setLocalGameStarted] = useState(false);
  const [showInvitePicker, setShowInvitePicker] = useState(false);
  const [friends, setFriends] = useState<IFriend[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const opponentName = isBotGame
    ? "AI Bot"
    : gameState?.player1Id === user?.id
      ? gameState?.player2Username || t.game.opponent
      : gameState?.player1Username || t.game.opponent;
  const myName = user?.userName || t.game.you;

  useEffect(() => {
    let ignore = false;
    if (lobbyTab === "invite" && friends.length === 0) {
      setLoadingFriends(true);
      friendService
        .getFriends({ name: null, userStatus: UserStatusEnum.All })
        .then((res: IApiResponse<IUser[]>) => {
          if (!ignore) setFriends((res.data ?? []) as IFriend[]);
        })
        .catch(() => {})
        .finally(() => {
          if (!ignore) setLoadingFriends(false);
        });
    }
    return () => {
      ignore = true;
    };
  }, [lobbyTab, friends.length]);

  useEffect(() => {
    if (!roomId || !gameState?.player2Id) {
      setLocalGameStarted(false);
    }
  }, [roomId, gameState?.player2Id]);

  const filteredFriends = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return friends;
    return friends.filter((f) =>
      `${f.firstName ?? ""} ${f.lastName ?? ""} ${f.userName ?? ""}`
        .toLowerCase()
        .includes(term),
    );
  }, [friends, searchQuery]);

  const handleClick = (index: number) => {
    if (!gameState || gameState.isFinished) return;
    if (!isMyTurn) return;
    if (board[index] === "X" || board[index] === "O") return;
    makeMove(index);
  };
  const startGameNew = (friendId: string | null = null) => {
    if (!gameState || user?.id !== gameState?.player1Id) return;
    setLocalGameStarted(true);
    startGame(friendId ?? gameState.player2Id ?? null);
  };

  const handleInvite = (friendId: string) => {
    inviteFriend(friendId);
    setLobbyTab("quick");
  };

  const lobbyTabs = useMemo<GTabItem<LobbyTab>[]>(
    () => [
      {
        id: "quick",
        label: t.lobby.tabs.quick,
        icon: <Sparkles className="w-4 h-4" />,
      },
      {
        id: "invite",
        label: t.lobby.tabs.invite,
        icon: <UserPlus className="w-4 h-4" />,
      },
    ],
    [t],
  );

  const getWinnerMessage = () => {
    if (opponentDisconnected) {
      return {
        title: t.game.opponentForfeited,
        description: t.game.opponentForfeitedDesc,
        icon: <Trophy className="w-16 h-16 text-success" />,
        color: "text-neon-green",
      };
    }
    if (gameState?.winnerPlayerId === user?.id) {
      return {
        title: t.game.victory,
        description: t.game.victoryDesc,
        icon: <Trophy className="w-16 h-16 text-warning" />,
        color: "text-warning",
      };
    }
    if (gameState?.isFinished && !gameState.winnerPlayerId) {
      return {
        title: t.game.draw,
        description: t.game.drawDesc,
        icon: <Handshake className="w-16 h-16 text-neon-cyan" />,
        color: "text-neon-cyan",
      };
    }
    return {
      title: t.game.defeat,
      description: t.game.defeatDesc,
      icon: <Frown className="w-16 h-16 text-error" />,
      color: "text-error",
    };
  };

  return (
    <div className={ttt.page}>
      {/* LOBBY / MATCHMAKING CARD */}
      {!roomId && (
        <div className={ttt.panel}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-neon-cyan/5 rounded-full blur-2xl" />

          {!isSearching ? (
            <div>
              <div className="flex justify-center mb-6">
                <div className={ttt.iconTile}>
                  <Swords className="w-8 h-8 text-text" />
                </div>
              </div>
              <h1 className="text-3xl font-black tracking-tight mb-2 text-text">
                {t.lobby.title}
              </h1>
              <p className="text-text-secondary text-sm mb-6">
                {t.lobby.subtitle}
              </p>

              <GTabs
                tabs={lobbyTabs}
                value={lobbyTab}
                onChange={setLobbyTab}
                variant="pills"
                fullWidth
                className="mb-6"
              />

              {lobbyTab === "quick" ? (
                <div className="space-y-4">
                  <GButton
                    onClick={findMatch}
                    disabled={!isConnected}
                    fullWidth
                    leftIcon={<Sparkles className="w-5 h-5" />}
                  >
                    {t.lobby.findMatch}
                  </GButton>
                  {!isConnected && (
                    <p className="text-xs text-error bg-error-bg py-2 rounded-lg">
                      {t.lobby.connecting}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col text-start">
                  <div className="mb-4">
                    <GInputSearch
                      value={searchQuery}
                      onChange={setSearchQuery}
                      placeholder={t.lobby.searchFriends}
                    />
                  </div>

                  <div className={ttt.friendsList}>
                    {loadingFriends ? (
                      <div className="flex justify-center items-center h-32">
                        <GSpinner />
                      </div>
                    ) : filteredFriends.length > 0 ? (
                      <FriendsList
                        friends={filteredFriends}
                        onSelectFriend={handleInvite}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-32 text-text-muted text-sm">
                        <Frown className="w-8 h-8 mb-2 opacity-50" />
                        {t.lobby.noFriendsFound}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-center">
                <GSpinner size="lg" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text">
                  {t.lobby.searchingTitle}
                </p>
                <p className="text-xs text-text-muted mt-1">
                  {t.lobby.searchingSubtitle}
                </p>
              </div>
              <GButton onClick={resetGame} variant="secondary" fullWidth>
                {t.lobby.cancelSearch}
              </GButton>
            </div>
          )}
        </div>
      )}

      {/* WAITING FOR OPPONENT */}
      {roomId && !gameState?.player2Id && (
        <div className="w-full max-w-lg space-y-6">
          <div className={ttt.scoreBar}>
            {/* Player 1 */}
            <div className="col-span-3 flex flex-col items-center text-center p-2 relative">
              <div className={ttt.playerAvatar}>
                <User className="w-8 h-8 text-primary" />
              </div>
              <span className="text-sm font-semibold text-text mt-3 truncate max-w-full">
                {gameState?.player1Id === user?.id
                  ? `${myName} (You)`
                  : gameState?.player1Username || t.game.player1}
              </span>
            </div>
            {/* VS */}
            <div className="col-span-1 flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-text-muted">VS</span>
              <div className="w-px h-10 bg-border/40 mt-1" />
            </div>
            {/* Player 2 (waiting) */}
            <div className="col-span-3 flex flex-col items-center text-center p-2 relative opacity-50">
              <div className="relative w-16 h-16 rounded-xl flex items-center justify-center border-2 border-dashed border-border-light bg-surface/50">
                <GSpinner size="sm" className="text-text-secondary" />
              </div>
              <span className="text-sm font-semibold text-text mt-3 truncate max-w-full">
                {t.game.waiting}
              </span>
            </div>
          </div>
          <p className="text-center text-text-secondary text-sm">
            {t.lobby.waitingForOpponent}
          </p>
          <div className="flex flex-col gap-3">
            {gameState?.player1Id === user?.id && (
              <>
                <GButton
                  onClick={() => startGameNew(null)}
                  fullWidth
                  leftIcon={<Play className="w-5 h-5" />}
                >
                  Start Game (vs AI)
                </GButton>
                <GButton
                  onClick={() => setShowInvitePicker(true)}
                  fullWidth
                  variant="secondary"
                  leftIcon={<UserPlus className="w-5 h-5" />}
                >
                  Invite Friend
                </GButton>
              </>
            )}
            <GButton onClick={resetGame} variant="secondary">
              {t.lobby.cancelMatch}
            </GButton>
          </div>

          {/* INVITE FRIEND PICKER */}
          {showInvitePicker && (
            <div className="bg-surface/50 border border-border/60 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-text">
                  Invite a Friend
                </h3>
                <GButton
                  onClick={() => setShowInvitePicker(false)}
                  variant="secondary"
                  size="sm"
                >
                  Cancel
                </GButton>
              </div>
              <GInputSearch
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search friends..."
              />
              <div className="mt-3 max-h-40 overflow-y-auto custom-scrollbar">
                {loadingFriends ? (
                  <GSpinner size="sm" />
                ) : filteredFriends.length > 0 ? (
                  <FriendsList
                    friends={filteredFriends}
                    onSelectFriend={(friendId) => {
                      inviteToRoom(friendId);
                      setShowInvitePicker(false);
                    }}
                  />
                ) : (
                  <p className="text-xs text-text-muted text-center py-4">
                    No friends found
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* GAME FOUND - PRE-START SCREEN */}
      {roomId && gameState?.player2Id && !gameState.hasStarted && (
        <div className={ttt.panelLg}>
          <div className={ttt.accentBar} />
          <h2 className="text-2xl font-black text-text mb-6">
            {t.lobby.opponentFound}
          </h2>

          <div className="flex items-center justify-center gap-6 mb-10">
            <div className="flex flex-col items-center">
              <div className={ttt.xSymbolBox}>
                <span className={ttt.symbol}>X</span>
              </div>
              <span className={`text-sm font-bold mt-3 text-text truncate ${ttt.maxPlayerName}`}>
                {gameState.player1Id === user?.id
                  ? t.game.you
                  : gameState.player1Username}
              </span>
            </div>

            <div className="text-text-muted font-black italic text-xl">VS</div>

            <div className="flex flex-col items-center">
              <div className={ttt.oSymbolBox}>
                <span className={ttt.symbol}>O</span>
              </div>
              <span className={`text-sm font-bold mt-3 text-text truncate ${ttt.maxPlayerName}`}>
                {gameState.player2Id === user?.id
                  ? t.game.you
                  : gameState.player2Username}
              </span>
            </div>
          </div>

          <GButton
            disabled={user?.id !== gameState.player1Id}
            onClick={() => startGameNew(gameState.player2Id)}
            fullWidth
            size="lg"
            leftIcon={<Play className="w-6 h-6 fill-current" />}
          >
            {user?.id === gameState.player1Id
              ? t.lobby.startGame
              : t.lobby.waitingForStart}
          </GButton>
        </div>
      )}

      {/* GAME IN PROGRESS (BOARD) */}
      {roomId && gameState?.player2Id && gameState.hasStarted && (
        <div className="w-full max-w-lg space-y-6">
          {/* PLAYERS PANEL */}
          <div className={ttt.scoreBar}>
            {/* Player 1 (X) */}
            <div className="col-span-3 flex flex-col items-center text-center p-2 relative">
              <div
                className={`relative w-16 h-16 rounded-xl flex items-center justify-center border-2 ${
                  gameState?.currentTurnPlayerId === gameState?.player1Id &&
                  !gameState?.isFinished
                    ? `${ttt.playerXActive}`
                    : "border-border-light bg-surface"
                }`}
              >
                {isBotGame && gameState?.player1Id !== user?.id ? (
                  <Bot className="w-8 h-8 text-neon-blue" />
                ) : (
                  <User className="w-8 h-8 text-text-secondary" />
                )}
                <span className={ttt.badgeX}>X</span>
              </div>
              <span className="text-sm font-semibold text-text mt-3 truncate max-w-full">
                {gameState?.player1Id === user?.id
                  ? `${myName} (You)`
                  : isBotGame
                    ? "AI Bot"
                    : gameState?.player1Username || t.game.player1}
              </span>
              {gameState?.currentTurnPlayerId === gameState?.player1Id &&
                !gameState?.isFinished && (
                  <span className={`${ttt.turnX} mt-1`}>
                    Turn
                  </span>
                )}
            </div>
            {"\n"}
            {/* VS */}
            <div className="col-span-1 flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-text-muted">VS</span>
              <div className="w-px h-10 bg-border/40 mt-1" />
            </div>

            {/* Player 2 (O) */}
            <div className="col-span-3 flex flex-col items-center text-center p-2 relative">
              <div
                className={`relative w-16 h-16 rounded-xl flex items-center justify-center border-2 ${
                  gameState?.currentTurnPlayerId === gameState?.player2Id &&
                  !gameState?.isFinished
                    ? `${ttt.playerOActive}`
                    : "border-border-light bg-surface"
                }`}
              >
                {isBotGame && gameState?.player2Id !== user?.id ? (
                  <Bot className="w-8 h-8 text-neon-magenta" />
                ) : (
                  <User className="w-8 h-8 text-text-secondary" />
                )}
                 <span className={ttt.badgeO}>O</span>
              </div>
              <span className="text-sm font-semibold text-text mt-3 truncate max-w-full">
                {gameState?.player2Id === user?.id ? (
                  `${myName} (You)`
                ) : isBotGame ? (
                  <>
                    AI Bot{" "}
                    <Bot className="w-3.5 h-3.5 inline text-neon-magenta" />
                  </>
                ) : (
                  gameState?.player2Username || t.game.player2
                )}
              </span>
              {gameState?.currentTurnPlayerId === gameState?.player2Id &&
                !gameState?.isFinished && (
                  <span className={`${ttt.turnO} mt-1`}>
                    Turn
                  </span>
                )}
            </div>
          </div>

          {/* TURN STATUS BANNER */}
          {!gameState?.isFinished && (
            <div
              className={`w-full py-3 px-4 rounded-xl border text-center font-bold text-sm flex items-center justify-center gap-2 ${
                isMyTurn
                  ? "bg-primary-muted border-primary/30 text-text"
                  : "bg-surface border-border text-text-secondary"
              }`}
            >
              <Zap
                className={`w-4 h-4 ${isMyTurn ? "text-neon-cyan" : "text-text-muted"}`}
              />
              {isMyTurn
                ? t.game.yourTurn
                : t.game.waitingFor.replace("{name}", opponentName)}
            </div>
          )}

          {/* BOARD */}
          <div className="relative">
            <div className="grid grid-cols-3 gap-3 bg-bg-card border border-border rounded-3xl p-5 relative">
              {board.map((cell, i) => {
                const isCellActive =
                  cell !== "X" &&
                  cell !== "O" &&
                  isMyTurn &&
                  !gameState?.isFinished;
                return (
                  <GButton
                    key={i}
                    onClick={() => handleClick(i)}
                    disabled={!isCellActive}
                    className={`${ttt.cellBase} ${
                      cell === "X"
                        ? ttt.cellX
                        : cell === "O"
                          ? ttt.cellO
                          : "bg-surface border-border-light hover:border-primary/40 hover:bg-surface-alt cursor-pointer"
                    }`}
                  >
                    {cell === "X" && (
                      <span className="text-accent">
                        X
                      </span>
                    )}
                    {cell === "O" && (
                      <span className="text-warning">
                        O
                      </span>
                    )}
                    {isCellActive && (
                      <span className="opacity-0 group-hover:opacity-25 text-text-secondary text-3xl">
                        {mySymbol}
                      </span>
                    )}
                  </GButton>
                );
              })}
            </div>

            {/* END GAME OVERLAY */}
            {gameState?.isFinished && (
              <div className="absolute inset-0 bg-bg/95 rounded-3xl border border-border flex flex-col items-center justify-center p-6 text-center">
                {getWinnerMessage().icon}
                <h2
                  className={`text-2xl font-black mt-4 ${getWinnerMessage().color}`}
                >
                  {getWinnerMessage().title}
                </h2>
                <p className="text-text-secondary text-sm mt-2 max-w-xs leading-relaxed">
                  {getWinnerMessage().description}
                </p>
                <div className="flex gap-4 mt-8 w-full max-w-xs">
                  <GButton onClick={findMatch} className="flex-1">
                    {t.end.playAgain}
                  </GButton>
                  <GButton
                    onClick={resetGame}
                    variant="secondary"
                    className="flex-1"
                    leftIcon={<Home className="w-4 h-4" />}
                  >
                    {t.end.lobby}
                  </GButton>
                </div>
              </div>
            )}
          </div>

          {/* LEAVE BUTTON */}
          {!gameState?.isFinished && (
            <div className="flex justify-center">
              <GButton
                onClick={leaveGame}
                variant="dangerOutline"
                size="sm"
              >
                Leave Game
              </GButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TicTacToePage;
