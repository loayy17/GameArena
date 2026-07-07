"use client";

import { useEffect, useMemo, useState } from "react";
import { MatchResultEnum } from "@/domain/enum/MatchResultEnum";
import { mockMatchHistory } from "@/domain/constant/match_history.config";
import type {
  IMatchHistory,
  IMatchHistorySummary,
} from "@/domain/meta/IMatchHistory";

type MatchHistoryFilter = "all" | MatchResultEnum;

function buildSummary(matches: IMatchHistory[]): IMatchHistorySummary {
  return matches.reduce(
    (acc, match) => {
      acc.total += 1;
      if (match.result === MatchResultEnum.Win) acc.wins += 1;
      if (match.result === MatchResultEnum.Loss) acc.losses += 1;
      if (match.result === MatchResultEnum.Draw) acc.draws += 1;
      return acc;
    },
    { wins: 0, losses: 0, draws: 0, total: 0 },
  );
}

function useMatchHistory(filter: MatchHistoryFilter = "all", limit?: number) {
  const [matches, setMatches] = useState<IMatchHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 400));
      if (!alive) return;

      const sorted = [...mockMatchHistory].sort(
        (a, b) => b.playedAt.getTime() - a.playedAt.getTime(),
      );
      setMatches(sorted);
      setLoading(false);
    };

    void load();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const list =
      filter === "all"
        ? matches
        : matches.filter((match) => match.result === filter);
    return limit ? list.slice(0, limit) : list;
  }, [filter, limit, matches]);

  const summary = useMemo(() => buildSummary(matches), [matches]);

  return { matches: filtered, summary, loading };
}

export { useMatchHistory, type MatchHistoryFilter };
