import { matchHistoryApi } from "@/repositories/proxy/matchHistory.api";
import { withFullName } from "@/domain/lib/userUtils";

import type { IMatchHistory } from "@/domain/meta/IMatchHistory";
import type { TPromise } from "@/domain/type/TCommon";

class MatchHistoryService {
  private api = matchHistoryApi.api;

  async getMatchHistory(): TPromise<IMatchHistory[]> {
    const result = await this.api.getMatchHistory<IMatchHistory[]>();
    if (result.data) {
      result.data.forEach((match) => {
        match.completedAt = new Date(match.completedAt);
        match.opponent = withFullName(match.opponent);
      });
    }
    return result;
  }
}

export const matchHistoryService = new MatchHistoryService();