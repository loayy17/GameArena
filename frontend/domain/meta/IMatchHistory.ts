import { MatchStatusEnum } from "../enum/MatchStatusEnum";
import type { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import type { IUserSummary } from "./IUserSummary";

interface IMatchHistory {
  id: string;
  completedAt: Date;
  isWinner: boolean;
  result: MatchStatusEnum;
  opponent: IUserSummary;
  kind: GamesKindEnum;
}

export type { IMatchHistory };
