interface ITicTacToeGameState {
  roomId: string;
  board: string[];
  currentTurnPlayerId: string;
  winnerPlayerId?: string;
  winnerSymbol?: string;
  isFinished: boolean;
  player1Id: string;
  player1Username: string;
  player2Id?: string;
  player2Username?: string;
  hasStarted: boolean;
  isFull: boolean;
  isPrivate: boolean;
  isBotGame: boolean;
}
export type { ITicTacToeGameState };
