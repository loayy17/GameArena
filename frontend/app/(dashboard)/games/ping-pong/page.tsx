"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
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

// Logical board dimensions (backend coordinates)
const LOGICAL_W = 600;
const LOGICAL_H = 400;
const PADDLE_W_LOGICAL = 10;
const PADDLE_H_LOGICAL = 80;
const BALL_SIZE_LOGICAL = 10;

function PingPongPage() {
  const { state, sendAction } = useGame();
  const { user } = useAuth();

  const keysDown = useRef<Set<string>>(new Set());
  const rafId = useRef<number | null>(null);

  const stateRef = useRef(state);
  const userRef = useRef(user);
  const sendActionRef = useRef(sendAction);

  const lastMouseDirectionRef = useRef<"UP" | "DOWN" | null>(null);
  const rafMouseSendRef = useRef<number | null>(null);
  const lastMouseSendAtRef = useRef<number>(0);

  const boardRef = useRef<HTMLDivElement | null>(null);
  const [boardRect, setBoardRect] = useState<DOMRectReadOnly | null>(null);

  useEffect(() => {
    stateRef.current = state;
  });
  useEffect(() => {
    userRef.current = user;
  });
  useEffect(() => {
    sendActionRef.current = sendAction;
  });

  // Keyboard input
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

  // Track board size with ResizeObserver
  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setBoardRect(entry.contentRect);
      }
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Mouse/Pointer control
  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!stateRef.current || !userRef.current) return;

      const ppState = stateRef.current as IPingPongGameState;
      const currentUser = userRef.current;
      if (ppState.isFinished) return;

      const rect = el.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const clampedY = Math.max(0, Math.min(rect.height, y));

      const isPlayer1 = ppState.player1Id === currentUser.id;
      const paddleYBackend = isPlayer1 ? ppState.player1PaddleY : ppState.player2PaddleY;

      // Convert rendered Y -> backend Y (0..LOGICAL_H)
      const pointerBackendY = (clampedY / rect.height) * LOGICAL_H;

      const dir: "UP" | "DOWN" = pointerBackendY < paddleYBackend ? DIRECTION_UP : DIRECTION_DOWN;

      const now = performance.now();
      const shouldSend = now - lastMouseSendAtRef.current >= 16;

      if (!shouldSend) return;
      lastMouseDirectionRef.current = dir;
      lastMouseSendAtRef.current = now;

      if (rafMouseSendRef.current != null) return;
      rafMouseSendRef.current = requestAnimationFrame(() => {
        rafMouseSendRef.current = null;
        const send = sendActionRef.current;
        send({ type: ACTION_MOVE_PADDLE, direction: dir });
      });
    };

    el.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      el.removeEventListener("pointermove", handlePointerMove);
      if (rafMouseSendRef.current != null) cancelAnimationFrame(rafMouseSendRef.current);
    };
  }, []);

  if (!state || !("ballPosition" in state)) {
    return <GameLayoutWrapper gameType={GamesKindEnum.PingPong}>{null}</GameLayoutWrapper>;
  }

  const pongState = state as IPingPongGameState;
  const { ballPosition, player1PaddleY, player2PaddleY, player1Score, player2Score, isFinished } = pongState;

  // Calculate scale factors based on actual board rect
  const scaleX = boardRect ? boardRect.width / LOGICAL_W : 1;
  const scaleY = boardRect ? boardRect.height / LOGICAL_H : 1;

  // Paddle dimensions in rendered pixels
  const paddleW = PADDLE_W_LOGICAL * scaleX;
  const paddleH = PADDLE_H_LOGICAL * scaleY;
  const ballSize = BALL_SIZE_LOGICAL * Math.min(scaleX, scaleY);

  // Backend coords are top-left aligned for paddles, center for ball
  const rawBallLeft = ballPosition.x * scaleX;
  const rawBallTop = ballPosition.y * scaleY;

  const ballLeft = Math.max(0, Math.min(rawBallLeft - ballSize / 2, (boardRect?.width ?? LOGICAL_W) - ballSize));
  const ballTop = Math.max(0, Math.min(rawBallTop - ballSize / 2, (boardRect?.height ?? LOGICAL_H) - ballSize));

  const p1Top = Math.max(0, Math.min(player1PaddleY * scaleY, (boardRect?.height ?? LOGICAL_H) - paddleH));
  const p2Top = Math.max(0, Math.min(player2PaddleY * scaleY, (boardRect?.height ?? LOGICAL_H) - paddleH));

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

        <div className="flex justify-center">
          <div
            ref={boardRef}
            className="relative bg-surface border-2 border-border-light rounded-lg mx-auto w-full max-w-full overflow-hidden"
            style={{ aspectRatio: boardRect && boardRect.width > boardRect.height ? "3/2" : "2/3" }}>
            <div className="absolute inset-y-0 left-1/2 w-px border-l-2 border-dashed border-border opacity-50" />

            <div className="absolute left-[2px] bg-accent rounded" style={{ width: paddleW, height: paddleH, top: p1Top }} />
            <div className="absolute right-[2px] bg-warning rounded" style={{ width: paddleW, height: paddleH, top: p2Top }} />

            <div
              className={clsx("absolute bg-primary rounded-full", !isFinished && "animate-pulse")}
              style={{ width: ballSize, height: ballSize, left: ballLeft, top: ballTop }}
            />
          </div>
        </div>

        {!isFinished && <div className="mt-4 text-center text-xs text-text-muted">Use W/S or &uarr;/&darr; to move your paddle</div>}
      </GCard>
    </GameLayoutWrapper>
  );
}

export default PingPongPage;
