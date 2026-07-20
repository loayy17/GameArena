interface PlayerColors {
  box: string;
  badge: string;
  turn: string;
}

interface PlayerCardProps {
  playerId?: string;
  playerUsername?: string;
  symbol?: string;
  isBot?: boolean;
  fallbackName: string;
  isTurn: boolean;
  symbolColors?: PlayerColors;
}

export type { PlayerCardProps, PlayerColors };
