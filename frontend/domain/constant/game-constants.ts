import type { THashMap } from "../type/TCommon";

export const INPUT_THROTTLE_MS = {
  PING_PONG: 16,
  SNAKE: 60,
} as const;

export const SWIPE_THRESHOLD_PX = 20;

export const PLAY_AGAIN_TIMEOUT_MS = 30000;

export const RPS_CHOICES = ["Rock", "Paper", "Scissors"] as const;

export const RPS_CHOICE_EMOJI: THashMap<string, string> = {
  Rock: "✊",
  Paper: "✋",
  Scissors: "✌️",
};
