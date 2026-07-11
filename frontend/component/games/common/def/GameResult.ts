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
}

interface GameResultProps {
  winnerPlayerId?: string;
  isFinished: boolean;
  userId?: string;
  opponentDisconnected: boolean;
  t: GameResultTranslations;
  endT: GameResultEndTranslations;
  onPlayAgain: () => void;
  onLobby: () => void;
}

export type { GameResultProps, GameResultTranslations, GameResultEndTranslations };
