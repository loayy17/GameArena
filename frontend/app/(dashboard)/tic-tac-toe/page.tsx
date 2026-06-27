"use client";

import { useTicTacToe } from "@/Hooks/useTicTacToe";
import { useAuth } from "@/app/AuthProvider";
import { TButton } from "@/component/common/TButton";
import {
  Swords,
  Trophy,
  Frown,
  Handshake,
  Loader2,
  User,
  Home,
  Sparkles,
  Zap,
} from "lucide-react";
// import { useTranslation } from "@/Hooks/useTranslation";
// import { en, type TicTacToeTranslations } from "./i18n/en.i18n";
// import { ar } from "./i18n/ar.i18n";

function TicTacToePage() {
  const { user } = useAuth();
  const {
    board,
    gameState,
    roomId,
    isSearching,
    isConnected,
    opponentDisconnected,
    findMatch,
    makeMove,
    resetGame,
  } = useTicTacToe();

  //   const t = useTranslation({ en, ar }) as TicTacToeTranslations; // used if you want i18n later

  const isMyTurn = gameState?.currentTurnPlayerId === user?.id;
  const mySymbol = gameState?.player1Id === user?.id ? "X" : "O";
  const opponentName =
    gameState?.player1Id === user?.id
      ? gameState?.player2Username || "Opponent"
      : gameState?.player1Username || "Opponent";
  const myName = user?.userName || "You";

  const handleClick = (index: number) => {
    if (!gameState || gameState.isFinished) return;
    if (!isMyTurn) return;
    if (board[index]) return;
    makeMove(index);
  };

  const getWinnerMessage = () => {
    if (opponentDisconnected) {
      return {
        title: "Opponent Forfeited!",
        description: "Your opponent left the game. You win by default!",
        icon: <Trophy className="w-16 h-16 text-neon-green animate-bounce" />,
        color: "text-neon-green",
      };
    }
    if (gameState?.winnerPlayerId === user?.id) {
      return {
        title: "VICTORY! 🎉",
        description: "Spectacular play! You defeated your opponent.",
        icon: <Trophy className="w-16 h-16 text-yellow-400 animate-bounce" />,
        color: "text-yellow-400",
      };
    }
    if (gameState?.isFinished && !gameState.winnerPlayerId) {
      return {
        title: "IT'S A DRAW! 🤝",
        description: "A hard-fought battle! It's a tie.",
        icon: <Handshake className="w-16 h-16 text-neon-cyan" />,
        color: "text-neon-cyan",
      };
    }
    return {
      title: "DEFEAT! 😢",
      description: "Good effort, but opponent claimed victory this time.",
      icon: <Frown className="w-16 h-16 text-red-400" />,
      color: "text-red-400",
    };
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] w-full py-8 px-4 md:px-8 relative z-10">
      {/* LOBBY / MATCHMAKING CARD */}
      {!roomId && (
        <div className="w-full max-w-md bg-bg-card/70 border border-border/80 rounded-3xl p-8 shadow-2xl text-center animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-neon-cyan/5 rounded-full blur-2xl" />
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary to-neon-purple flex items-center justify-center shadow-[0_0_25px_-5px_#7c5cfc]">
              <Swords className="w-8 h-8 text-text" />
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2 text-text">
            Tic Tac{" "}
            <span className="bg-linear-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              Toe
            </span>
          </h1>
          <p className="text-text-secondary text-sm mb-8">
            Deploy strategic marks in a classic 3x3 duel
          </p>

          {isSearching ? (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text animate-pulse">
                  Searching for opponent...
                </p>
                <p className="text-xs text-text-muted mt-1">
                  Checking GameArena servers
                </p>
              </div>
              <TButton
                onClick={resetGame}
                className="w-full py-3 bg-surface hover:bg-surface-alt text-text-secondary hover:text-text rounded-xl border border-border transition-all text-sm font-bold"
              >
                Cancel Search
              </TButton>
            </div>
          ) : (
            <div className="space-y-4">
              <TButton
                onClick={findMatch}
                disabled={!isConnected}
                className="w-full py-4 bg-linear-to-r from-primary to-primary-hover text-text rounded-xl font-bold shadow-[0_4px_20px_rgba(124,92,252,0.3)] hover:shadow-[0_4px_25px_rgba(124,92,252,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-5 h-5" />
                Find Match
              </TButton>
              {!isConnected && (
                <p className="text-xs text-error bg-error-bg py-2 rounded-lg">
                  Connecting to Game Server...
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* WAITING FOR OPPONENT */}
      {roomId && !gameState?.player2Id && (
        <div className="w-full max-w-lg space-y-6 animate-fade-in">
          <div className="grid grid-cols-7 items-center bg-bg-card/50  border border-border/60 rounded-2xl p-4 shadow-lg">
            {/* Player 1 */}
            <div className="col-span-3 flex flex-col items-center text-center p-2 relative">
              <div className="relative w-16 h-16 rounded-xl flex items-center justify-center border-2 border-border-light bg-surface">
                <User className="w-8 h-8 text-text-secondary" />
              </div>
              <span className="text-sm font-semibold text-text mt-3 truncate max-w-full">
                {gameState?.player1Id === user?.id
                  ? `${myName} (You)`
                  : gameState?.player1Username || "Player 1"}
              </span>
            </div>
            {/* VS */}
            <div className="col-span-1 flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-text-muted">VS</span>
              <div className="w-px h-10 bg-border/40 mt-1" />
            </div>
            {/* Player 2 (waiting) */}
            <div className="col-span-3 flex flex-col items-center text-center p-2 relative">
              <div className="relative w-16 h-16 rounded-xl flex items-center justify-center border-2 border-border-light bg-surface">
                <User className="w-8 h-8 text-text-secondary" />
              </div>
              <span className="text-sm font-semibold text-text mt-3 truncate max-w-full">
                {gameState?.player2Id === user?.id
                  ? `${myName} (You)`
                  : gameState?.player2Username || "Player 2"}
              </span>
            </div>
          </div>
          <p className="text-center text-text-secondary text-sm animate-pulse">
            Waiting for opponent to join...
          </p>
        </div>
      )}

      {/* GAME IN PROGRESS */}
      {roomId && gameState?.player2Id && (
        <div className="w-full max-w-lg space-y-6 animate-fade-in">
          {/* PLAYERS PANEL */}
          <div className="grid grid-cols-7 items-center bg-bg-card/50  border border-border/60 rounded-2xl p-4 shadow-lg">
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
                <User className="w-8 h-8 text-text-secondary" />
                <span className="absolute -bottom-2 -right-2 w-6 h-6 rounded-md bg-neon-blue text-black font-black text-xs flex items-center justify-center shadow-md">
                  X
                </span>
              </div>
              <span className="text-sm font-semibold text-text mt-3 truncate max-w-full">
                {gameState?.player1Id === user?.id
                  ? `${myName} (You)`
                  : gameState?.player1Username || "Player 1"}
              </span>
              {gameState?.currentTurnPlayerId === gameState?.player1Id &&
                !gameState?.isFinished && (
                  <span className="text-[10px] text-neon-blue font-bold tracking-widest mt-1 uppercase">
                    Turn
                  </span>
                )}
            </div>

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
                <User className="w-8 h-8 text-text-secondary" />
                <span className="absolute -bottom-2 -left-2 w-6 h-6 rounded-md bg-neon-magenta text-text font-black text-xs flex items-center justify-center shadow-md">
                  O
                </span>
              </div>
              <span className="text-sm font-semibold text-text mt-3 truncate max-w-full">
                {gameState?.player2Id === user?.id
                  ? `${myName} (You)`
                  : gameState?.player2Username || "Player 2"}
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
                ? "Your Turn - Make your move!"
                : `Waiting for ${opponentName}...`}
            </div>
          )}

          {/* BOARD */}
          <div className="relative">
            <div className="grid grid-cols-3 gap-3 bg-bg-card/75 border border-border/80 rounded-3xl p-5 shadow-2xl relative">
              {board.map((cell, i) => {
                const isCellActive =
                  !cell && isMyTurn && !gameState?.isFinished;
                return (
                  <TButton
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
                  </TButton>
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
                  <TButton
                    onClick={findMatch}
                    className="flex-1 py-3 bg-linear-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary text-text font-bold rounded-xl transition-all shadow-lg text-sm"
                  >
                    Play Again
                  </TButton>
                  <TButton
                    onClick={resetGame}
                    className="flex-1 py-3 bg-surface hover:bg-surface-alt border border-border text-text-secondary hover:text-text font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-1.5"
                  >
                    <Home className="w-4 h-4" />
                    Lobby
                  </TButton>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TicTacToePage;
