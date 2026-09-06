import type { MatchStatusEnum } from "../enum/MatchStatusEnum";
import type { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import type { IUserSummary } from "./IUserSummary";

interface IMatchHistory {
  id: string;
  completedAt: Date;
  result: MatchStatusEnum;
  opponent: IUserSummary;
  kind: GamesKindEnum;
}

export type { IMatchHistory };
