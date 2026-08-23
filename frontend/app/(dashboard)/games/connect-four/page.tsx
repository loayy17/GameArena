"use client";

import { cn } from "@/lib/cn";

import type { IConnectFourGameState } from "@/app/providers/def/IGameState";
import { useGame } from "@/app/providers/GameProvider";
import { GCard } from "@/component/common/GCard";
import { GameLayoutWrapper } from "@/component/games/GameLayoutWrapper";
import { ScoreBoard } from "@/component/games/common/ScoreBoard";
import { GameActionTypes } from "@/domain/constant/game-actions";
import { CellEnum } from "@/domain/enum/CellEnum";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { useGameStateView } from "@/hooks/useGameStateView";
import { useGameTranslation } from "@/hooks/useGameTranslation";

const DIRECTIONS = [
  [1, 0],
  [0, 1],
  [1, 1],
  [1, -1],
];

function findWinningCells(board: number[][]): Set<string> {
  const cols = board.length;
  const rows = board[0]?.length ?? 0;

  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      const piece = board[col]?.[row];
      if (!piece) continue;

      for (const [dCol, dRow] of DIRECTIONS) {
        const cells: Array<[number, number]> = [[col, row]];
        for (let step = 1; step < 4; step++) {
          const nextCol = col + dCol * step;
          const nextRow = row + dRow * step;
          if (nextCol < 0 || nextCol >= cols || nextRow < 0 || nextRow >= rows || board[nextCol]?.[nextRow] !== piece) break;
          cells.push([nextCol, nextRow]);
        }
        if (cells.length === 4) return new Set(cells.map(([c, r]) => `${c}-${r}`));
      }
    }
  }

  return new Set();
}

function dropRow(column: number[]): number {
  for (let row = column.length - 1; row >= 0; row--) {
    if (column[row] === CellEnum.None) return row;
  }
  return -1;
}

function ConnectFourPage() {
  const { state, sendAction } = useGame();
  const t = useGameTranslation();
  const { isPlayer1, isMyTurn, isOver } = useGameStateView(state);

  if (!state || !("board" in state)) {
    return <GameLayoutWrapper gameType={GamesKindEnum.ConnectFour}>{null}</GameLayoutWrapper>;
  }

  const cfState = state as unknown as IConnectFourGameState;
  const { board, player1Score, player2Score, winScore } = cfState;
  const rows = board[0]?.length ?? 0;

  const winningCells = findWinningCells(board);
  const previewClass = isPlayer1 ? "group-hover:bg-accent/40" : "group-hover:bg-warning/40";

  return (
    <GameLayoutWrapper gameType={GamesKindEnum.ConnectFour}>
      <GCard padding={SizeEnum.md}>
        <ScoreBoard
          className="mb-5"
          winScore={winScore}
          left={{ score: player1Score, label: cfState.player1Username || t.game.player1, colorClass: "text-accent" }}
          right={{ score: player2Score, label: cfState.player2Username || t.game.player2, colorClass: "text-warning" }}
        />

        <div className="mx-auto w-full max-w-lg rounded-2xl border border-game-board-border bg-game-board p-2.5 shadow-inner">
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {board.map((column, col) => {
              const targetRow = dropRow(column);
              const playable = isMyTurn && !isOver && targetRow >= 0;
              return (
                <button
                  key={col}
                  type="button"
                  disabled={!playable}
                  onClick={() => sendAction({ type: GameActionTypes.PLACE, col })}
                  aria-label={`Drop in column ${col + 1}`}
                  className={cn(
                    "group flex flex-col gap-1.5 rounded-xl p-0.5 transition-colors sm:gap-2",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                    playable ? "cursor-pointer hover:bg-primary/10" : "cursor-default",
                  )}>
                  {Array.from({ length: rows }, (_, row) => {
                    const value = column[row];
                    const isPreview = playable && row === targetRow;
                    return (
                      <span
                        key={row}
                        className={cn(
                          "block aspect-square rounded-full transition-colors",
                          value === CellEnum.None && (isPreview ? `bg-bg-card ${previewClass}` : "bg-bg-card"),
                          value === CellEnum.PlayerOne && "animate-scale-in bg-accent",
                          value === CellEnum.PlayerTwo && "animate-scale-in bg-warning",
                          winningCells.has(`${col}-${row}`) && "ring-2 ring-inset ring-success",
                        )}
                      />
                    );
                  })}
                </button>
              );
            })}
          </div>
        </div>
      </GCard>
    </GameLayoutWrapper>
  );
}

export default ConnectFourPage;
