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
  isYou?: boolean;
  myName: string;
  fallbackName: string;
  isTurn: boolean;
  youSuffix?: string;
  aiBotLabel?: string;
  turnLabel?: string;
  symbolColors?: PlayerColors;
}

export type { PlayerCardProps, PlayerColors };
