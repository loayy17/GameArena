export interface IGameStateBase {
  roomId: string;
  player1Id: string;
  player1Username?: string;
  player2Id?: string;
  player2Username?: string;
  hasStarted: boolean;
  isFull: boolean;
  isPrivate: boolean;
  isBotGame: boolean;
  isFinished: boolean;
  currentTurnPlayerId?: string;
  winnerPlayerId?: string;
  score: [number, number];
}

export interface ITicTacToeGameState extends IGameStateBase {
  board: string[];
}

// Snake specific state
export interface ISnakeGameState extends IGameStateBase {
  grid: string[][];
  snakePositions: { x: number; y: number }[];
  foodPosition: { x: number; y: number };
}

// PingPong specific state
export interface IPingPongGameState extends IGameStateBase {
  ballPosition: { x: number; y: number };
  player1PaddleY: number;
  player2PaddleY: number;
  player1Score: number;
  player2Score: number;
}

export type IGameState = ITicTacToeGameState | ISnakeGameState | IPingPongGameState;
