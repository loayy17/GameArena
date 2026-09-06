"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { MatchStatusEnum } from "@/domain/enum/MatchStatusEnum";
import { matchHistoryService } from "@/services/def/MatchHistoryService";

import { useErrorMessage } from "./useErrorMessage";

import type { IMatchHistory } from "@/domain/meta/IMatchHistory";
import type { TNullable } from "@/domain/type/TCommon";
import type { AxiosError } from "axios";
import type { IApiResponse } from "@/domain/meta/IApiResponse";

function buildSummary(matches: IMatchHistory[]) {
  return matches.reduce(
    (acc, match) => {
      acc.total += 1;
      if (match.result === MatchStatusEnum.Win) acc.wins += 1;
      if (match.result === MatchStatusEnum.Lost) acc.losses += 1;
      if (match.result === MatchStatusEnum.Draw) acc.draws += 1;
      return acc;
    },
    { wins: 0, losses: 0, draws: 0, total: 0 },
  );
}

function useMatchHistory(statusFilter: MatchStatusEnum = MatchStatusEnum.All, limit?: number) {
  const [allMatches, setAllMatches] = useState<IMatchHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<TNullable<string>>(null);
  const errorMsg = useErrorMessage();
  const loadGenRef = useRef(0);

  const reload = useCallback(() => {
    const gen = ++loadGenRef.current;
    setLoading(true);
    setError(null);
    matchHistoryService
      .getMatchHistory()
      .then((res) => {
        if (loadGenRef.current !== gen) return;
        if (res.data) setAllMatches(res.data);
      })
      .catch((err: unknown) => {
        if (loadGenRef.current !== gen) return;
        const axiosErr = err as AxiosError<IApiResponse<unknown>>;
        const code = axiosErr?.response?.data?.errorCode;
        setError(errorMsg(code));
      })
      .finally(() => {
        if (loadGenRef.current === gen) setLoading(false);
      });
  }, [errorMsg]);

  useEffect(() => {
    const timer = setTimeout(reload, 0);
    return () => clearTimeout(timer);
  }, [reload]);

  const summary = useMemo(() => buildSummary(allMatches), [allMatches]);

  const matches = useMemo(() => {
    const list = statusFilter === MatchStatusEnum.All ? allMatches : allMatches.filter((m) => m.result === statusFilter);
    return limit ? list.slice(0, limit) : list;
  }, [statusFilter, limit, allMatches]);

  return { matches, summary, loading, error, reload };
}

export { useMatchHistory };
