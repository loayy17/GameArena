"use client";

import { useState } from "react";

import { isSnakeState } from "@/app/providers/def/IGameState";
import { useGame } from "@/app/providers/GameProvider";
import { cn } from "@/lib/cn";
import { GCard } from "@/component/common/GCard";
import { GameLayoutWrapper } from "@/component/games/GameLayoutWrapper";
import { ScoreBoard } from "@/component/games/common/ScoreBoard";
import { DIRECTIONS, GameActionTypes, INPUT_THROTTLE_MS } from "@/domain/constant/games";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import { useGameInput } from "@/hooks/useGameInput";
import { useGameStateView } from "@/hooks/useGameStateView";
import { useGameTranslation } from "@/hooks/useGameTranslation";

import type { TNullable } from "@/domain/type/TCommon";
import type { IGameBoardProps, ISnakeLayerProps, ISnakePoint, ISnakeSegmentProps } from "./def/SnakeBoard";

function SnakeSegment({ point, boardWidth, boardHeight, className, scale }: ISnakeSegmentProps) {
  const [prev, setPrev] = useState<ISnakePoint>(point);

  let jumped = false;
  if (prev.x !== point.x || prev.y !== point.y) {
    jumped = Math.abs(prev.x - point.x) > 1 || Math.abs(prev.y - point.y) > 1;
    setPrev(point);
  }

  return (
    <div
      className={cn(
        "absolute will-change-transform",
        jumped ? "transition-none" : "transition-transform duration-100 ease-linear",
        className,
      )}
      style={{
        width: `${100 / boardWidth}%`,
        height: `${100 / boardHeight}%`,
        transform: `translate(${point.x * 100}%, ${point.y * 100}%) scale(${scale})`,
      }}
    />
  );
}

function SnakeLayer({ snake, bodyClass, headClass, boardWidth, boardHeight }: ISnakeLayerProps) {
  return snake.map((segment, index) => (
    <SnakeSegment
      key={index}
      point={segment}
      boardWidth={boardWidth}
      boardHeight={boardHeight}
      className={index === 0 ? headClass : bodyClass}
      scale={index === 0 ? 1 : 0.92}
    />
  ));
}

function GameBoard({ boardWidth, boardHeight, mySnake, oppSnake, food }: IGameBoardProps) {
  const inBounds = (p: ISnakePoint) => p.x >= 0 && p.x < boardWidth && p.y >= 0 && p.y < boardHeight;

  return (
    <div dir="ltr" className="absolute inset-0">
      <SnakeLayer
        snake={oppSnake}
        bodyClass="rounded-[30%] bg-warning/80"
        headClass="rounded-md bg-warning"
        boardWidth={boardWidth}
        boardHeight={boardHeight}
      />
      <SnakeLayer
        snake={mySnake}
        bodyClass="rounded-[30%] bg-accent/80"
        headClass="rounded-md bg-accent"
        boardWidth={boardWidth}
        boardHeight={boardHeight}
      />
      {food && inBounds(food) && (
        <div
          className="absolute"
          style={{
            width: `${100 / boardWidth}%`,
            height: `${100 / boardHeight}%`,
            transform: `translate(${food.x * 100}%, ${food.y * 100}%)`,
          }}>
          <div className="size-full animate-pulse rounded-full bg-danger shadow-lg shadow-danger/30" />
        </div>
      )}
    </div>
  );
}

function SnakePage() {
  const { state } = useGame();
  const t = useGameTranslation();
  const { isPlayer1 } = useGameStateView(state);
  const [board, setBoard] = useState<TNullable<HTMLDivElement>>(null);

  const isActive = isSnakeState(state) && !state.isFinished;

  const resolveDirection = (keys: Set<string>): "UP" | "DOWN" | "LEFT" | "RIGHT" | null => {
    let pressed: "UP" | "DOWN" | "LEFT" | "RIGHT" | null = null;
    for (const d of ["UP", "DOWN", "LEFT", "RIGHT"] as const) {
      if (DIRECTIONS[d].some((k) => keys.has(k))) {
        if (pressed) return null;
        pressed = d;
      }
    }
    return pressed;
  };

  useGameInput({
    gameKey: "SNAKE",
    isActive,
    resolveDirection,
    createAction: (dir) => ({ type: GameActionTypes.CHANGE_DIRECTION, direction: dir }),
    throttleMs: INPUT_THROTTLE_MS.SNAKE,
    boardElement: board,
    pointerMode: "swipe",
  });

  if (!isSnakeState(state)) {
    return <GameLayoutWrapper gameType={GamesKindEnum.Snake}>{null}</GameLayoutWrapper>;
  }

  const snakeState = state;

  const mySnake = isPlayer1 ? snakeState.player1Snake : snakeState.player2Snake;
  const oppSnake = isPlayer1 ? snakeState.player2Snake : snakeState.player1Snake;
  const myScore = isPlayer1 ? snakeState.score[0] : snakeState.score[1];
  const oppScore = isPlayer1 ? snakeState.score[1] : snakeState.score[0];

  return (
    <GameLayoutWrapper gameType={GamesKindEnum.Snake}>
      <GCard className="p-4">
        <ScoreBoard
          className="mb-4"
          variant="compact"
          left={{ score: myScore, label: t.game.you, colorClass: "text-accent" }}
          right={{ score: oppScore, label: t.game.opponent, colorClass: "text-warning" }}
        />

        <div
          ref={setBoard}
          className="relative overflow-hidden rounded-2xl border border-game-board-border bg-game-board shadow-inner touch-none select-none w-full max-w-2xl mx-auto"
          style={{ aspectRatio: `${snakeState.boardWidth} / ${snakeState.boardHeight}` }}>
          <GameBoard
            boardWidth={snakeState.boardWidth}
            boardHeight={snakeState.boardHeight}
            mySnake={mySnake}
            oppSnake={oppSnake}
            food={snakeState.food}
          />
        </div>

        {!snakeState.isFinished && (
          <p className="mt-4 text-center text-xs text-text-muted">
            <span className="md:hidden">{t.snake.swipeHint}</span>
            <span className="hidden md:inline">{t.snake.arrowKeysHint}</span>
          </p>
        )}
      </GCard>
    </GameLayoutWrapper>
  );
}

export default SnakePage;
