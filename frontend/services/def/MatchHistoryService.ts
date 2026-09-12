import { matchHistoryApi } from "@/repositories/proxy/matchHistory.api";

import type { IMatchHistory } from "@/domain/meta/IMatchHistory";
import type { TPromise } from "@/domain/type/TCommon";

class MatchHistoryService {
  private api = matchHistoryApi.api;

  async getMatchHistory(): TPromise<IMatchHistory[]> {
    const result = await this.api.getMatchHistory<IMatchHistory[]>();
    if (result.data) {
      result.data.forEach((match) => {
        match.completedAt = new Date(match.completedAt);
      });
    }
    return result;
  }
}

export const matchHistoryService = new MatchHistoryService();