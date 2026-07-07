import type { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import type { MatchResultEnum } from "@/domain/enum/MatchResultEnum";

interface IMatchHistory {
  id: string;
  game: GamesKindEnum;
  opponentName: string;
  result: MatchResultEnum;
  playedAt: Date;
  score?: string;
}

interface IMatchHistorySummary {
  wins: number;
  losses: number;
  draws: number;
  total: number;
}

export type { IMatchHistory, IMatchHistorySummary };
