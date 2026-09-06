import type { UserStatusEnum } from "../enum/UserStatusEnum";
import type { TNullable } from "@/domain/type/TCommon";
import type { IMatchHistory } from "./IMatchHistory";

interface IUserPublicProfile {
  id: string;
  userName: TNullable<string>;
  firstName: TNullable<string>;
  lastName: TNullable<string>;
  fullName: TNullable<string>;
  avatarUrl?: TNullable<string>;
  rank?: TNullable<number>;
  status: UserStatusEnum;
  createdAt: Date;
  totalMatches: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  recentMatches: IMatchHistory[];
}
export type { IUserPublicProfile };
