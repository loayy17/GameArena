import type { GamesKindEnum } from "@/domain/enum/GamesKindEnum";

export type RPSChoice = "Rock" | "Paper" | "Scissors";

export interface IGameState {
  roomId: string;
  gameType: GamesKindEnum;
  player1Id?: string;
  player1Username?: string;
  player2Id?: string;
  player2Username?: string;
  hasStarted: boolean;
  isFull: boolean;
  isPrivate: boolean;
  isBotGame: boolean;
  isFinished: boolean;
  winnerPlayerId?: string;
  winnerSymbol?: string;
  currentTurnPlayerId?: string;
  score: [number, number];
  boardWidth: number;
  boardHeight: number;
  player1Score: number;
  player2Score: number;
  winScore: number;
  tickRateHz: number;

  board?: string[];
  player1Snake?: { x: number; y: number }[];
  player2Snake?: { x: number; y: number }[];
  food?: { x: number; y: number };
  player1Direction?: string;
  player2Direction?: string;

  ball?: { x: number; y: number; vx: number; vy: number };
  ballSize?: number;
  player1Paddle?: { x: number; y: number; height: number };
  player2Paddle?: { x: number; y: number; height: number };
  paddleWidth?: number;

  player1Choice?: RPSChoice;
  player2Choice?: RPSChoice;
}

export type ITicTacToeGameState = IGameState & { board: string[] };
export type ISnakeGameState = IGameState & {
  player1Snake: { x: number; y: number }[];
  player2Snake: { x: number; y: number }[];
  food: { x: number; y: number };
};
export type IPingPongGameState = IGameState & {
  ball: { x: number; y: number; vx: number; vy: number };
  ballSize: number;
  player1Paddle: { x: number; y: number; height: number };
  player2Paddle: { x: number; y: number; height: number };
  paddleWidth: number;
};
export type IConnectFourGameState = Omit<IGameState, "board"> & { board: number[][] };
