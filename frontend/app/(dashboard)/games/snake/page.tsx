"use client";

import { useState } from "react";

import { isSnakeState } from "@/app/providers/def/IGameState";
import { useGame } from "@/app/providers/GameProvider";
import { cn } from "@/lib/cn";
import { GCard } from "@/component/common/GCard";
import { GameLayoutWrapper } from "@/component/games/GameLayoutWrapper";
import { ScoreBoard } from "@/component/games/common/ScoreBoard";
import {
    DIRECTIONS,
    GameActionTypes,
    INPUT_THROTTLE_MS,
} from "@/domain/constant/games";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import { useGameInput } from "@/hooks/useGameInput";
import { useGameStateView } from "@/hooks/useGameStateView";
import { useGameTranslation } from "@/hooks/useGameTranslation";

import type { TNullable } from "@/domain/type/TCommon";
import type { ISnakePoint } from "./def/SnakeBoard";

const clampPercent = (value: number, total: number) =>
    `${(value / total) * 100}%`;

function SnakeSegment({
    point,
    boardWidth,
    boardHeight,
    className,
    scale,
}: {
    point: ISnakePoint;
    boardWidth: number;
    boardHeight: number;
    className: string;
    scale: number;
}) {
    const [prev, setPrev] = useState<ISnakePoint>(point);
    const jumped =
        Math.abs(prev.x - point.x) > 1 || Math.abs(prev.y - point.y) > 1;
    if (jumped) setPrev(point);

    return (
        <div
            className={cn(
                "absolute will-change-transform",
                jumped
                    ? "transition-none"
                    : "transition-transform duration-100 ease-linear",
                className,
            )}
            style={{
                width: clampPercent(1, boardWidth),
                height: clampPercent(1, boardHeight),
                transform: `translate(${point.x * 100}%, ${point.y * 100}%) scale(${scale})`,
            }}
        />
    );
}

function SnakePage() {
    const { state } = useGame();
    const t = useGameTranslation();
    const { isPlayer1 } = useGameStateView(state);
    const [board, setBoard] = useState<TNullable<HTMLDivElement>>(null);

    const isActive = isSnakeState(state) && !state.isFinished;

    const resolveDirection = (
        keys: Set<string>,
    ): "UP" | "DOWN" | "LEFT" | "RIGHT" | null => {
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
        createAction: (dir) => ({
            type: GameActionTypes.CHANGE_DIRECTION,
            direction: dir,
        }),
        throttleMs: INPUT_THROTTLE_MS.SNAKE,
        boardElement: board,
        pointerMode: "swipe",
    });

    if (!isSnakeState(state)) {
        return (
            <GameLayoutWrapper gameType={GamesKindEnum.Snake}>
                {null}
            </GameLayoutWrapper>
        );
    }

    const { boardWidth, boardHeight, player1Snake, player2Snake, food, score } =
        state;
    const mySnake = isPlayer1 ? player1Snake : player2Snake;
    const oppSnake = isPlayer1 ? player2Snake : player1Snake;
    const myScore = isPlayer1 ? score[0] : score[1];
    const oppScore = isPlayer1 ? score[1] : score[0];

    return (
        <GameLayoutWrapper gameType={GamesKindEnum.Snake}>
            <GCard className="p-2 sm:p-4">
                <ScoreBoard
                    className="mb-4"
                    variant="compact"
                    left={{
                        score: myScore,
                        label: t.game.you,
                        colorClass: "text-accent",
                    }}
                    right={{
                        score: oppScore,
                        label: t.game.opponent,
                        colorClass: "text-warning",
                    }}
                />

                <div
                    ref={setBoard}
                    className="relative overflow-hidden rounded-2xl border border-game-board-border bg-game-board shadow-inner touch-none select-none w-full max-w-2xl mx-auto"
                    style={{ aspectRatio: `${boardWidth} / ${boardHeight}` }}
                    dir="ltr"
                >
                    {oppSnake.map((point, i) => (
                        <SnakeSegment
                            key={`opp-${i}`}
                            point={point}
                            boardWidth={boardWidth}
                            boardHeight={boardHeight}
                            className={
                                i === 0
                                    ? "rounded-md bg-warning"
                                    : "rounded-[30%] bg-warning/80"
                            }
                            scale={i === 0 ? 1 : 0.92}
                        />
                    ))}
                    {mySnake.map((point, i) => (
                        <SnakeSegment
                            key={`me-${i}`}
                            point={point}
                            boardWidth={boardWidth}
                            boardHeight={boardHeight}
                            className={
                                i === 0
                                    ? "rounded-md bg-accent"
                                    : "rounded-[30%] bg-accent/80"
                            }
                            scale={i === 0 ? 1 : 0.92}
                        />
                    ))}
                    {food &&
                        food.x >= 0 &&
                        food.x < boardWidth &&
                        food.y >= 0 &&
                        food.y < boardHeight && (
                            <div
                                className="absolute"
                                style={{
                                    width: clampPercent(1, boardWidth),
                                    height: clampPercent(1, boardHeight),
                                    transform: `translate(${food.x * 100}%, ${food.y * 100}%)`,
                                }}
                            >
                                <div className="size-full animate-pulse rounded-full bg-danger shadow-lg shadow-danger/30" />
                            </div>
                        )}
                </div>

                {!state.isFinished && (
                    <p className="mt-4 text-center text-xs text-text-muted">
                        <span className="md:hidden">{t.snake.swipeHint}</span>
                        <span className="hidden md:inline">
                            {t.snake.arrowKeysHint}
                        </span>
                    </p>
                )}
            </GCard>
        </GameLayoutWrapper>
    );
}

export default SnakePage;

