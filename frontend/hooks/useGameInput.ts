"use client";

import { useEffect, useRef } from "react";

import { useGame } from "@/app/providers/GameProvider";
import { PADDLE_KEYS, DIRECTIONS, SWIPE_THRESHOLD_PX } from "@/domain/constant/games";

import type { TGameAction } from "@/domain/constant/games";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const OPPOSITE: Record<Direction, Direction> = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};

interface IDragPosition {
  y: number;
  height: number;
}

interface GameInputConfig<T extends HTMLElement = HTMLElement> {
  gameKey: "PING_PONG" | "SNAKE";
  isActive: boolean;
  resolveDirection: (keys: Set<string>) => Direction | null;
  createAction: (direction: Direction) => TGameAction;
  throttleMs: number;
  boardElement?: T | null;
  pointerMode?: "swipe" | "drag";

  getCurrentPosition?: () => IDragPosition | null;
  createPositionAction?: (y: number) => TGameAction;
}

export function useGameInput<T extends HTMLElement>(config: GameInputConfig<T>) {
  const { sendAction } = useGame();
  const keysDown = useRef<Set<string>>(new Set());
  const lastActionRef = useRef<Direction | null>(null);
  const lastSendTimeRef = useRef(0);
  const configRef = useRef(config);

  useEffect(() => {
    configRef.current = config;
  });

  useEffect(() => {
    if (!config.isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDirectionKey(e.key, config.gameKey)) {
        e.preventDefault();
        keysDown.current.add(e.key);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (isDirectionKey(e.key, config.gameKey)) {
        keysDown.current.delete(e.key);
      }
    };
    const pressed = keysDown.current;

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      pressed.clear();
    };
  }, [config.isActive, config.gameKey]);

  useEffect(() => {
    if (!config.isActive) return;

    let rafId: number | null = null;

    const tick = () => {
      const { resolveDirection, createAction, throttleMs } = configRef.current;
      const direction = resolveDirection(keysDown.current);
      const now = Date.now();

      if (direction !== lastActionRef.current) {
        lastActionRef.current = direction;
        if (direction) {
          lastSendTimeRef.current = now;
          sendAction(createAction(direction));
        }
      } else if (direction && now - lastSendTimeRef.current >= throttleMs) {
        lastSendTimeRef.current = now;
        sendAction(createAction(direction));
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [config.isActive, sendAction]);

  useEffect(() => {
    const board = config.boardElement;
    if (!config.isActive || !config.pointerMode || !board) return;

    let activePointerId: number | null = null;
    let startPointerX = 0;
    let startPointerY = 0;
    let startPaddleY = 0;
    let paddleHeight = 0;
    let boardHeightPx = 0;
    let swipeFired = false;

    const releasePointer = (pointerId: number) => {
      if (pointerId !== activePointerId) return;
      activePointerId = null;
      try {
        if (board.hasPointerCapture(pointerId)) board.releasePointerCapture(pointerId);
      } catch {
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (!e.isPrimary || activePointerId !== null) return;
      if (config.pointerMode === "swipe" && e.pointerType !== "touch") return;

      activePointerId = e.pointerId;
      startPointerX = e.clientX;
      startPointerY = e.clientY;
      swipeFired = false;

      if (config.pointerMode === "drag") {
        const pos = configRef.current.getCurrentPosition?.() ?? null;
        if (!pos) {
          activePointerId = null;
          return;
        }
        const rect = board.getBoundingClientRect();
        if (rect.height <= 0) {
          activePointerId = null;
          return;
        }
        boardHeightPx = rect.height;
        startPaddleY = pos.y;
        paddleHeight = pos.height;
        lastSendTimeRef.current = Date.now();

        try {
          board.setPointerCapture(e.pointerId);
        } catch {
        }
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerId !== activePointerId) return;

      const cfg = configRef.current;

      if (cfg.pointerMode === "swipe" && !swipeFired) {
        const dx = e.clientX - startPointerX;
        const dy = e.clientY - startPointerY;
        if (Math.max(Math.abs(dx), Math.abs(dy)) >= SWIPE_THRESHOLD_PX) {
          const direction = swipeDirection(dx, dy);
          const last = lastActionRef.current;
          if (!(last && direction === OPPOSITE[last])) {
            swipeFired = true;
            lastActionRef.current = direction;
            lastSendTimeRef.current = Date.now();
            sendAction(cfg.createAction(direction));
          }
        }
        return;
      }

      if (cfg.pointerMode !== "drag" || !cfg.createPositionAction || e.clientY === startPointerY) return;

      const deltaY = e.clientY - startPointerY;
      const clampedY = Math.max(0, Math.min(1 - paddleHeight, startPaddleY + deltaY / boardHeightPx));

      const now = Date.now();
      if (now - lastSendTimeRef.current < cfg.throttleMs) return;
      lastSendTimeRef.current = now;
      sendAction(cfg.createPositionAction(clampedY));
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (e.pointerId !== activePointerId) return;

      const cfg = configRef.current;
      if (cfg.pointerMode === "swipe" && !swipeFired) {
        const dx = e.clientX - startPointerX;
        const dy = e.clientY - startPointerY;
        if (Math.max(Math.abs(dx), Math.abs(dy)) >= SWIPE_THRESHOLD_PX) {
          const direction = swipeDirection(dx, dy);
          const last = lastActionRef.current;
          if (!(last && direction === OPPOSITE[last])) {
            lastActionRef.current = direction;
            lastSendTimeRef.current = Date.now();
            sendAction(cfg.createAction(direction));
          }
        }
      }

      releasePointer(e.pointerId);
    };

    const handlePointerCancel = (e: PointerEvent) => {
      releasePointer(e.pointerId);
    };

    board.addEventListener("pointerdown", handlePointerDown);
    board.addEventListener("pointermove", handlePointerMove);
    board.addEventListener("pointerup", handlePointerUp);
    board.addEventListener("pointercancel", handlePointerCancel);
    return () => {
      board.removeEventListener("pointerdown", handlePointerDown);
      board.removeEventListener("pointermove", handlePointerMove);
      board.removeEventListener("pointerup", handlePointerUp);
      board.removeEventListener("pointercancel", handlePointerCancel);
      activePointerId = null;
    };
  }, [config.isActive, config.pointerMode, config.boardElement, sendAction]);
}

function swipeDirection(dx: number, dy: number): Direction {
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? "RIGHT" : "LEFT";
  return dy > 0 ? "DOWN" : "UP";
}

function isDirectionKey(key: string, gameKey: "PING_PONG" | "SNAKE"): boolean {
  if (gameKey === "PING_PONG") {
    return PADDLE_KEYS.UP.has(key) || PADDLE_KEYS.DOWN.has(key);
  }
  const allKeys = Object.values(DIRECTIONS).flat() as string[];
  return allKeys.includes(key);
}