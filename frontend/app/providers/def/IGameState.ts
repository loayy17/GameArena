import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";

import type { TNullable } from "@/domain/type/TCommon";

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
  winningCells?: string[];
  currentTurnPlayerId?: string;
  score: [number, number];
  boardWidth: number;
  boardHeight: number;
  player1Score: number;
  player2Score: number;
  winScore: number;
  tickRateHz: number;

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
export type IConnectFourGameState = IGameState & { board: number[][] };

export type IRpsGameState = IGameState & {
  player1Choice: RPSChoice;
  player2Choice: RPSChoice;
};

const has = <K extends string>(state: TNullable<IGameState>, key: K): boolean => !!state && key in state;

export function isTicTacToeState(state: TNullable<IGameState>): state is ITicTacToeGameState {
  return state?.gameType === GamesKindEnum.TicTacToe && has(state, "board");
}

export function isSnakeState(state: TNullable<IGameState>): state is ISnakeGameState {
  return state?.gameType === GamesKindEnum.Snake && has(state, "player1Snake");
}

export function isPingPongState(state: TNullable<IGameState>): state is IPingPongGameState {
  return state?.gameType === GamesKindEnum.PingPong && has(state, "ball");
}

export function isConnectFourState(state: TNullable<IGameState>): state is IConnectFourGameState {
  return state?.gameType === GamesKindEnum.ConnectFour && has(state, "board");
}

export function isRpsState(state: TNullable<IGameState>): state is IRpsGameState {
  return state?.gameType === GamesKindEnum.RockPaperScissors;
}
