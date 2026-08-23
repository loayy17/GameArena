"use client";

import { cn } from "@/lib/cn";

import type { ITicTacToeGameState } from "@/app/providers/def/IGameState";
import { useGame } from "@/app/providers/GameProvider";
import { GCard } from "@/component/common/GCard";
import { GameLayoutWrapper } from "@/component/games/GameLayoutWrapper";
import { ScoreBoard } from "@/component/games/common/ScoreBoard";
import { GameActionTypes } from "@/domain/constant/game-actions";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { useGameStateView } from "@/hooks/useGameStateView";

const BOARD_EMPTY = ".";
const PLAYER_X = "X";
const PLAYER_O = "O";

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function TicTacToePage() {
  const { state, sendAction } = useGame();
  const { isMyTurn, isOver } = useGameStateView(state);

  if (!state || !("board" in state)) {
    return <GameLayoutWrapper gameType={GamesKindEnum.TicTacToe}>{null}</GameLayoutWrapper>;
  }

  const tttState = state as ITicTacToeGameState;
  const { board, player1Score, player2Score, winScore } = tttState;

  const winningLine = WIN_LINES.find(([a, b, c]) => board[a] !== BOARD_EMPTY && board[a] === board[b] && board[a] === board[c]);
  const winningCells = new Set(winningLine ?? []);

  const isCellPlayable = (cell: string): boolean => cell === BOARD_EMPTY && isMyTurn && !isOver;

  return (
    <GameLayoutWrapper gameType={GamesKindEnum.TicTacToe}>
      <GCard padding={SizeEnum.md}>
        <ScoreBoard
          className="mb-5"
          winScore={winScore}
          left={{ score: player1Score, label: PLAYER_X, colorClass: "text-primary" }}
          right={{ score: player2Score, label: PLAYER_O, colorClass: "text-accent" }}
        />
        <div className="mx-auto w-full max-w-sm rounded-2xl border border-game-board-border bg-game-board shadow-inner p-2">
          <div className="grid grid-cols-3 gap-2">
            {board.map((cell, index) => {
              const playable = isCellPlayable(cell);
              const isWinning = winningCells.has(index);
              return (
                <button
                  key={index}
                  type="button"
                  disabled={!playable}
                  onClick={() => sendAction({ type: GameActionTypes.MAKE_MOVE, cell: index })}
                  aria-label={`Cell ${index + 1}`}
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-xl bg-surface transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                    playable && "cursor-pointer hover:bg-primary-muted",
                    !playable && "cursor-default",
                    isWinning && "bg-success-bg ring-2 ring-inset ring-success/60",
                  )}>
                  {cell !== BOARD_EMPTY && (
                    <span className={cn("animate-scale-in text-5xl font-extrabold sm:text-6xl", cell === PLAYER_X ? "text-primary" : "text-accent")}>
                      {cell}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </GCard>
    </GameLayoutWrapper>
  );
}

export default TicTacToePage;
