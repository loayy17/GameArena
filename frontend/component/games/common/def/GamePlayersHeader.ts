interface Player {
  id?: string;
  username?: string;
  isTurn: boolean;
  isYou: boolean;
}

interface GamePlayersHeaderProps {
  player1: Player;
  player2: Player;
  player1Symbol?: string;
  player2Symbol?: string;
  isBotGame: boolean;
  currentUserId?: string;
  myName: string;
  player1Fallback: string;
  player2Fallback: string;
  vsLabel?: string;
  youSuffix?: string;
  aiBotLabel?: string;
  turnLabel?: string;
  player1Colors?: {
    box: string;
    badge: string;
    turn: string;
  };
  player2Colors?: {
    box: string;
    badge: string;
    turn: string;
  };
}

export type { GamePlayersHeaderProps, Player };
