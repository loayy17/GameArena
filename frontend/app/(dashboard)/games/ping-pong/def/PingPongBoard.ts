import type { IPingPongGameState } from "@/app/providers/def/IGameState";

interface IPaddleProps {
  paddle: IPingPongGameState["player1Paddle"];
  paddleWidth: number;
  boardWidth: number;
  boardHeight: number;
  tickMs: number;
  colorClass: string;
}

export type { IPaddleProps };
