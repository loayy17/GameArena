interface GameResultTranslations {
  opponentForfeited: string;
  opponentForfeitedDesc: string;
  victory: string;
  victoryDesc: string;
  draw: string;
  drawDesc: string;
  defeat: string;
  defeatDesc: string;
}

interface GameResultEndTranslations {
  playAgain: string;
  lobby: string;
  waiting: string;
  accept: string;
  reject: string;
  playAgainRequest: string;
}

interface GameResultProps {
  winnerPlayerId?: string;
  userId?: string;
  opponentDisconnected: boolean;
  score?: [number, number];
  t: GameResultTranslations;
  endT: GameResultEndTranslations;
  onPlayAgain: () => void;
  onLobby: () => void;
  requestedPlayAgain: boolean;
  onRespondPlayAgain?: (accept: boolean) => void;
  pendingRequest?: { requesterId: string; requesterUsername: string } | null;
}

export type { GameResultProps, GameResultTranslations, GameResultEndTranslations };
