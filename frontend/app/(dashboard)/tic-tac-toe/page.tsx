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
import { FriendsList } from "@/component/SocialPanel/FriendsList";

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

  // Local UI States
  const [lobbyTab, setLobbyTab] = useState<LobbyTab>("quick");
  const [, setLocalGameStarted] = useState(false);
  const [showInvitePicker, setShowInvitePicker] = useState(false);

  // Friend Fetching States
  const [friends, setFriends] = useState<IFriend[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const opponentName =
    isBotGame
      ? "AI Bot"
      : gameState?.player1Id === user?.id
        ? gameState?.player2Username || t.game.opponent
        : gameState?.player1Username || t.game.opponent;
  const myName = user?.userName || t.game.you;

  // Fetch friends when invite tab is active
  useEffect(() => {
    let ignore = false;
    if (lobbyTab === "invite" && friends.length === 0) {
      setLoadingFriends(true);
      friendService
        .getFriends({ name: null, userStatus: UserStatusEnum.All })
        .then((res: { data: IFriend[] }) => {
          if (!ignore) setFriends(res.data || []);
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
        icon: <Trophy className="w-16 h-16 text-neon-green animate-bounce" />,
        color: "text-neon-green",
      };
    }
    if (gameState?.winnerPlayerId === user?.id) {
      return {
        title: t.game.victory,
        description: t.game.victoryDesc,
        icon: <Trophy className="w-16 h-16 text-yellow-400 animate-bounce" />,
        color: "text-yellow-400",
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
      icon: <Frown className="w-16 h-16 text-red-400" />,
      color: "text-red-400",
    };
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] w-full py-8 px-4 md:px-8 relative z-10">
      {/* LOBBY / MATCHMAKING CARD */}
      {!roomId && (
        <div className="w-full max-w-md bg-bg-card/70 border border-border/80 rounded-3xl p-8 shadow-2xl text-center animate-fade-in relative overflow-hidden transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-neon-cyan/5 rounded-full blur-2xl" />

          {!isSearching ? (
            <div className="animate-fade-in">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary to-neon-purple flex items-center justify-center shadow-[0_0_25px_-5px_#7c5cfc]">
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
                <div className="animate-fade-in flex flex-col text-left">
                  <div className="mb-4">
                    <GInputSearch
                      value={searchQuery}
                      onChange={setSearchQuery}
                      placeholder={t.lobby.searchFriends}
                    />
                  </div>

                  <div className="flex-1 overflow-y-auto max-h-62.5 pr-2 custom-scrollbar bg-surface/30 rounded-xl border border-border/50 p-2">
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
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-center">
                <GSpinner size="lg" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text animate-pulse">
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
            <div className="w-full max-w-lg space-y-6 animate-fade-in">
              <div className="grid grid-cols-7 items-center bg-bg-card/50 border border-border/60 rounded-2xl p-4 shadow-lg">
                {/* Player 1 */}
                <div className="col-span-3 flex flex-col items-center text-center p-2 relative">
                  <div className="relative w-16 h-16 rounded-xl flex items-center justify-center border-2 border-border-light bg-surface shadow-[0_0_15px_rgba(124,252,0.15)]">
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
              <p className="text-center text-text-secondary text-sm animate-pulse">
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
                <div className="bg-surface/50 border border-border/60 rounded-xl p-4 animate-fade-in">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-text">Invite a Friend</h3>
                    <GButton onClick={() => setShowInvitePicker(false)} variant="secondary" size="sm">
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
                      <p className="text-xs text-text-muted text-center py-4">No friends found</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

      {/* GAME FOUND - PRE-START SCREEN */}
      {roomId && gameState?.player2Id && !gameState.hasStarted && (
        <div className="w-full max-w-lg bg-bg-card/70 border border-border/80 rounded-3xl p-8 shadow-2xl text-center animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-neon-blue via-primary to-neon-magenta animate-pulse" />
          <h2 className="text-2xl font-black text-text mb-6">
            {t.lobby.opponentFound}
          </h2>

          <div className="flex items-center justify-center gap-6 mb-10">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl border-2 border-neon-blue bg-neon-blue/10 flex items-center justify-center shadow-[0_0_20px_rgba(0,210,255,0.2)]">
                <span className="text-3xl font-black text-neon-blue">X</span>
              </div>
              <span className="text-sm font-bold mt-3 text-text truncate max-w-25">
                {gameState.player1Id === user?.id
                  ? t.game.you
                  : gameState.player1Username}
              </span>
            </div>

            <div className="text-text-muted font-black italic text-xl">VS</div>

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl border-2 border-neon-magenta bg-neon-magenta/10 flex items-center justify-center shadow-[0_0_20px_rgba(224,64,251,0.2)]">
                <span className="text-3xl font-black text-neon-magenta">O</span>
              </div>
              <span className="text-sm font-bold mt-3 text-text truncate max-w-25">
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
        <div className="w-full max-w-lg space-y-6 animate-fade-in">
          {/* PLAYERS PANEL */}
          <div className="grid grid-cols-7 items-center bg-bg-card/50 border border-border/60 rounded-2xl p-4 shadow-lg">
            {/* Player 1 (X) */}
            <div className="col-span-3 flex flex-col items-center text-center p-2 relative">
              <div
                className={`relative w-16 h-16 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${
                  gameState?.currentTurnPlayerId === gameState?.player1Id &&
                  !gameState?.isFinished
                    ? "border-neon-blue bg-neon-blue/10 shadow-[0_0_15px_rgba(0,210,255,0.3)] animate-glow"
                    : "border-border-light bg-surface"
                }`}
              >
                {isBotGame && gameState?.player1Id !== user?.id ? (
                  <Bot className="w-8 h-8 text-neon-blue" />
                ) : (
                  <User className="w-8 h-8 text-text-secondary" />
                )}
                <span className="absolute -bottom-2 -right-2 w-6 h-6 rounded-md bg-neon-blue text-black font-black text-xs flex items-center justify-center shadow-md">
                  X
                </span>
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
                  <span className="text-[10px] text-neon-blue font-bold tracking-widest mt-1 uppercase">
                    Turn
                  </span>
                )}
            </div>{"\n"}
            {/* VS */}
            <div className="col-span-1 flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-text-muted">VS</span>
              <div className="w-px h-10 bg-border/40 mt-1" />
            </div>

            {/* Player 2 (O) */}
            <div className="col-span-3 flex flex-col items-center text-center p-2 relative">
              <div
                className={`relative w-16 h-16 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${
                  gameState?.currentTurnPlayerId === gameState?.player2Id &&
                  !gameState?.isFinished
                    ? "border-neon-magenta bg-neon-magenta/10 shadow-[0_0_15px_rgba(224,64,251,0.3)] animate-glow"
                    : "border-border-light bg-surface"
                }`}
              >
                {isBotGame && gameState?.player2Id !== user?.id ? (
                  <Bot className="w-8 h-8 text-neon-magenta" />
                ) : (
                  <User className="w-8 h-8 text-text-secondary" />
                )}
                <span className="absolute -bottom-2 -left-2 w-6 h-6 rounded-md bg-neon-magenta text-text font-black text-xs flex items-center justify-center shadow-md">
                  O
                </span>
              </div>
              <span className="text-sm font-semibold text-text mt-3 truncate max-w-full">
                {gameState?.player2Id === user?.id
                  ? `${myName} (You)`
                  : isBotGame
                    ? <>AI Bot <Bot className="w-3.5 h-3.5 inline text-neon-magenta" /></>
                    : gameState?.player2Username || t.game.player2}
              </span>
              {gameState?.currentTurnPlayerId === gameState?.player2Id &&
                !gameState?.isFinished && (
                  <span className="text-[10px] text-neon-magenta font-bold tracking-widest mt-1 uppercase">
                    Turn
                  </span>
                )}
            </div>
          </div>

          {/* TURN STATUS BANNER */}
          {!gameState?.isFinished && (
            <div
              className={`w-full py-3 px-4 rounded-xl border text-center font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                isMyTurn
                  ? "bg-primary-muted border-primary/30 text-text animate-pulse"
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
            <div className="grid grid-cols-3 gap-3 bg-bg-card/75 border border-border/80 rounded-3xl p-5 shadow-2xl relative">
              {board.map((cell, i) => {
                const isCellActive =
                  cell !== "X" && cell !== "O" && isMyTurn && !gameState?.isFinished;
                return (
                  <GButton
                    key={i}
                    onClick={() => handleClick(i)}
                    disabled={!isCellActive}
                    className={`aspect-square rounded-2xl flex items-center justify-center text-4xl font-black transition-all duration-300 border relative group ${
                      cell === "X"
                        ? "bg-neon-blue/5 border-neon-blue/20 text-neon-blue shadow-[inset_0_0_15px_rgba(0,210,255,0.05)]"
                        : cell === "O"
                          ? "bg-neon-magenta/5 border-neon-magenta/20 text-neon-magenta shadow-[inset_0_0_15px_rgba(224,64,251,0.05)]"
                          : "bg-surface border-border-light hover:border-primary/40 hover:bg-surface-alt cursor-pointer"
                    }`}
                  >
                    {cell === "X" && (
                      <span className="drop-shadow-[0_0_8px_rgba(0,210,255,0.5)] animate-fade-in">
                        X
                      </span>
                    )}
                    {cell === "O" && (
                      <span className="drop-shadow-[0_0_8px_rgba(224,64,251,0.5)] animate-fade-in">
                        O
                      </span>
                    )}
                    {isCellActive && (
                      <span className="opacity-0 group-hover:opacity-25 transition-opacity duration-200 text-text-secondary text-3xl">
                        {mySymbol}
                      </span>
                    )}
                  </GButton>
                );
              })}
            </div>

            {/* END GAME OVERLAY */}
            {gameState?.isFinished && (
              <div className="absolute inset-0 bg-bg/95 rounded-3xl border border-border flex flex-col items-center justify-center p-6 text-center animate-fade-in">
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
                variant="secondary"
                size="sm"
                className="text-red-400 border-red-400/30 hover:bg-red-400/10"
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
