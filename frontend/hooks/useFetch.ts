"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useFetch<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList = [],
): UseFetchResult<T> {
  const [data, setData] = useState<T>(null as unknown as T);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const genRef = useRef(0);

  const execute = useCallback(() => {
    const gen = ++genRef.current;
    setLoading(true);
    setError(null);

    fetcher()
      .then((result) => {
        if (gen === genRef.current) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (gen === genRef.current) {
          setError(
            err instanceof Error ? err.message : "An error occurred",
          );
          setLoading(false);
        }
      });
  }, deps);

  useEffect(() => {
    execute();
    return () => {
      genRef.current++;
    };
  }, [execute]);

  return { data, loading, error, reload: execute };
}
