import type { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import type { TNullable } from "@/domain/type/TCommon";

export interface IPlayerCardColors {
  box: string;
  badge: string;
  turn: string;
}

export type TPlayerResult = "win" | "loss" | "draw";

export interface IPlayerCardProps {
  playerId: TNullable<string>;
  playerUsername: TNullable<string>;
  symbol: string;
  isBot: boolean;
  fallbackName: string;
  isTurn: boolean;
  symbolColors?: IPlayerCardColors;
  score?: number;
  result?: TNullable<TPlayerResult>;
}

export interface IGameTurnIndicatorProps {
  isMyTurn: boolean;
  currentTurnText: string;
  waitingText: string;
  thinking?: boolean;
}

export interface IGamePlayersHeaderProps {
  gameType?: GamesKindEnum;
}
