"use client";

import clsx from "clsx";
import { useEffect, useRef } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useGame } from "@/app/providers/GameProvider";
import { GameLayoutWrapper } from "@/component/games/GameLayoutWrapper";
import { GCard } from "@/component/common/GCard";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import type { IPingPongGameState } from "@/app/providers/def/IGameState";

const ACTION_MOVE_PADDLE = "MOVE_PADDLE";
const DIRECTION_UP = "UP";
const DIRECTION_DOWN = "DOWN";
const PADDLE_KEYS = new Set(["ArrowUp", "ArrowDown", "w", "W", "s", "S"]);

function PingPongPage() {
  const { state, sendAction } = useGame();
  const { user } = useAuth();

  const keysDown = useRef<Set<string>>(new Set());
  const rafId = useRef<number | null>(null);

  const stateRef = useRef(state);
  const userRef = useRef(user);
  const sendActionRef = useRef(sendAction);

  useEffect(() => { stateRef.current = state; });
  useEffect(() => { userRef.current = user; });
  useEffect(() => { sendActionRef.current = sendAction; });

  useEffect(() => {
    const isPaddleKey = (key: string): boolean => PADDLE_KEYS.has(key);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaddleKey(e.key)) {
        e.preventDefault();
        keysDown.current.add(e.key);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysDown.current.delete(e.key);
    };

    const tick = () => {
      const currentState = stateRef.current;
      const currentUser = userRef.current;

      if (!currentState || !currentUser) {
        rafId.current = requestAnimationFrame(tick);
        return;
      }

      if (!currentState.isFinished && keysDown.current.size > 0) {
        const send = sendActionRef.current;
        const hasUpKey = ["ArrowUp", "w", "W"].some((key) => keysDown.current.has(key));
        const hasDownKey = ["ArrowDown", "s", "S"].some((key) => keysDown.current.has(key));

        if (hasUpKey) {
          send({ type: ACTION_MOVE_PADDLE, direction: DIRECTION_UP });
        } else if (hasDownKey) {
          send({ type: ACTION_MOVE_PADDLE, direction: DIRECTION_DOWN });
        }
      }

      rafId.current = requestAnimationFrame(tick);
    };

    const currentKeysDown = keysDown.current;

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      currentKeysDown.clear();
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  if (!state || !("ballPosition" in state)) {
    return <GameLayoutWrapper gameType={GamesKindEnum.PingPong}>{null}</GameLayoutWrapper>;
  }

  const pongState = state as IPingPongGameState;
  const { ballPosition, player1PaddleY, player2PaddleY, player1Score, player2Score, isFinished } = pongState;

  return (
    <GameLayoutWrapper gameType={GamesKindEnum.PingPong}>
      <GCard padding="md" rounded="3xl">
        <div className="flex justify-center gap-8 mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-accent">{player1Score}</div>
            <div className="text-xs text-text-muted">Player 1</div>
          </div>
          <div className="text-center text-text-muted font-bold">-</div>
          <div className="text-center">
            <div className="text-3xl font-bold text-warning">{player2Score}</div>
            <div className="text-xs text-text-muted">Player 2</div>
          </div>
        </div>

        <div className="relative bg-surface border-2 border-border-light rounded-lg mx-auto" style={{ width: 600, height: 400 }}>
          <div className="absolute inset-y-0 left-1/2 w-px border-l-2 border-dashed border-border opacity-50" />

          <div className="absolute left-2 bg-accent rounded" style={{ width: 10, height: 80, top: player1PaddleY }} />

          <div className="absolute right-2 bg-warning rounded" style={{ width: 10, height: 80, top: player2PaddleY }} />

          <div
            className={clsx("absolute bg-primary rounded-full", !isFinished && "animate-pulse")}
            style={{ width: 10, height: 10, left: ballPosition.x, top: ballPosition.y }}
          />
        </div>

        {!isFinished && <div className="mt-4 text-center text-xs text-text-muted">Use W/S or &uarr;/&darr; to move your paddle</div>}
      </GCard>
    </GameLayoutWrapper>
  );
}

export default PingPongPage;
