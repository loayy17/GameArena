"use client";

import { useState } from "react";

import type { IPingPongGameState } from "@/app/providers/def/IGameState";
import { useAuth } from "@/app/providers/AuthProvider";
import { useGame } from "@/app/providers/GameProvider";
import { GCard } from "@/component/common/GCard";
import { GameLayoutWrapper } from "@/component/games/GameLayoutWrapper";
import { ScoreBoard } from "@/component/games/common/ScoreBoard";
import { DirectionValues, GameActionTypes, PADDLE_KEYS } from "@/domain/constant/game-actions";
import { INPUT_THROTTLE_MS } from "@/domain/constant/game-constants";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { useGameInput } from "@/hooks/useGameInput";
import { useGameTranslation } from "@/hooks/useGameTranslation";
import { TNullable } from "@/domain/type/TCommon";

const calculatePercentage = (value: number, total: number) => `${(value / total) * 100}%`;

function PingPongPage() {
  const { state } = useGame();
  const { user } = useAuth();
  const t = useGameTranslation();
  const [board, setBoard] = useState<TNullable<HTMLDivElement>>(null);

  const isActive = !!state && "ball" in state && !state.isFinished;

  const resolveDirection = (keys: Set<string>): "UP" | "DOWN" | "LEFT" | "RIGHT" | null => {
    const up = PADDLE_KEYS.UP.intersection(keys).size > 0;
    const down = PADDLE_KEYS.DOWN.intersection(keys).size > 0;
    if (up && down) return null;
    if (up) return DirectionValues.UP;
    if (down) return DirectionValues.DOWN;
    return null;
  };

  useGameInput({
    gameKey: "PING_PONG",
    isActive,
    resolveDirection,
    createAction: (dir) => ({ type: GameActionTypes.MOVE_PADDLE, direction: dir as "UP" | "DOWN" }),
    createPositionAction: (y) => ({ type: GameActionTypes.SET_PADDLE, y }),
    throttleMs: INPUT_THROTTLE_MS.PING_PONG,
    boardElement: board,
    pointerMode: "drag",
    getCurrentPosition: () => {
      if (!state || !("ball" in state)) return null;
      const pongState = state as IPingPongGameState;
      const isPlayer1 = pongState.player1Id === user?.id;
      const paddle = isPlayer1 ? pongState.player1Paddle : pongState.player2Paddle;
      return { y: paddle.y / pongState.boardHeight, height: paddle.height / pongState.boardHeight };
    },
  });

  if (!state || !("ball" in state)) {
    return <GameLayoutWrapper gameType={GamesKindEnum.PingPong}>{null}</GameLayoutWrapper>;
  }

  const pongState = state as IPingPongGameState;
  const { boardWidth, boardHeight, ball, ballSize, player1Paddle, player2Paddle, paddleWidth, score, winScore, isFinished, tickRateHz } = pongState;
  const tickMs = Math.round(1000 / (tickRateHz || 20));

  return (
    <GameLayoutWrapper gameType={GamesKindEnum.PingPong}>
      <GCard padding={SizeEnum.md}>
        <ScoreBoard
          className="mb-4"
          winScore={winScore}
          left={{ score: score[0], label: pongState.player1Username || t.game.player1, colorClass: "text-accent" }}
          right={{ score: score[1], label: pongState.player2Username || t.game.player2, colorClass: "text-warning" }}
        />
        <div
          ref={setBoard}
          className="relative mx-auto w-full overflow-hidden rounded-2xl border border-game-board-border bg-game-board shadow-inner touch-none select-none"
          style={{ aspectRatio: boardWidth / boardHeight }}>
          <div className="absolute inset-y-2 left-1/2 w-px -translate-x-1/2 bg-game-board-border/60" />
          <div
            className="absolute rounded-md bg-accent shadow-md transition-[top,left] ease-linear will-change-[top,left]"
            style={{
              transitionDuration: `${tickMs}ms`,
              width: calculatePercentage(paddleWidth, boardWidth),
              height: calculatePercentage(player1Paddle.height, boardHeight),
              left: calculatePercentage(player1Paddle.x, boardWidth),
              top: calculatePercentage(player1Paddle.y, boardHeight),
            }}
          />
          <div
            className="absolute rounded-md bg-warning shadow-md transition-[top,left] ease-linear will-change-[top,left]"
            style={{
              transitionDuration: `${tickMs}ms`,
              width: calculatePercentage(paddleWidth, boardWidth),
              height: calculatePercentage(player2Paddle.height, boardHeight),
              left: calculatePercentage(player2Paddle.x, boardWidth),
              top: calculatePercentage(player2Paddle.y, boardHeight),
            }}
          />
          <div
            className="absolute rounded-full bg-primary shadow-lg shadow-primary/20 transition-[top,left] ease-linear will-change-[top,left]"
            style={{
              transitionDuration: `${tickMs}ms`,
              width: calculatePercentage(ballSize, boardWidth),
              aspectRatio: "1 / 1",
              left: calculatePercentage(ball.x - ballSize / 2, boardWidth),
              top: calculatePercentage(ball.y - ballSize / 2, boardHeight),
            }}
          />
        </div>
        {!isFinished && (
          <div className="mt-4 text-center text-xs text-text-muted">
            <span className="md:hidden">{t.pingpong.dragHint}</span>
            <span className="hidden md:inline">{t.pingpong.controlHint}</span>
          </div>
        )}
      </GCard>
    </GameLayoutWrapper>
  );
}

export default PingPongPage;
