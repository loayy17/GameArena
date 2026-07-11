"use client";

import clsx from "clsx";
import { useGame } from "@/app/providers/GameProvider";
import { useTranslation } from "@/hooks/useSetting";
import { en as gameEn, type GameTranslations } from "@/component/i18n/Game/en.i18n";
import { ar as gameAr } from "@/component/i18n/Game/ar.i18n";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import type { ISnakeGameState } from "@/app/providers/def/IGameState";
import { GameLayoutWrapper } from "@/component/games/GameLayoutWrapper";

function SnakePage() {
  const { state } = useGame();
  const t = useTranslation({ en: gameEn, ar: gameAr }) as GameTranslations;

  // GameLayoutWrapper handles all stages - we only render board when state has game-specific fields
  if (!state || !("grid" in state)) {
    return <GameLayoutWrapper gameType={GamesKindEnum.Snake}>{null}</GameLayoutWrapper>;
  }

  const snakeState = state as ISnakeGameState;
  const grid = snakeState.grid;
  const snakePositions = snakeState.snakePositions;
  const foodPosition = snakeState.foodPosition;
  const isFinished = snakeState.isFinished;

  const isSnakeCell = (row: number, col: number) => snakePositions.some((pos) => pos.x === col && pos.y === row);

  const isFoodCell = (row: number, col: number) => foodPosition.x === col && foodPosition.y === row;

  return (
    <GameLayoutWrapper gameType={GamesKindEnum.Snake}>
      <div className="bg-bg-card border border-border rounded-3xl p-5">
        <div className="grid gap-1">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1">
              {row.map((_, colIndex) => {
                const hasSnake = isSnakeCell(rowIndex, colIndex);
                const hasFood = isFoodCell(rowIndex, colIndex);

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={clsx(
                      "w-6 h-6 rounded transition-colors duration-150",
                      hasSnake
                        ? "bg-primary border border-primary-muted"
                        : hasFood
                          ? "bg-accent animate-pulse"
                          : "bg-surface border border-border-light",
                    )}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {!isFinished && <div className="mt-4 text-center text-xs text-text-muted">{t.snake.arrowKeysHint}</div>}
      </div>
    </GameLayoutWrapper>
  );
}

export default SnakePage;
