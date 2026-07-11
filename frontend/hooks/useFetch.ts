"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TNullable } from "@/domain/type/TCommon";

interface UseFetchResult<T> {
  data: TNullable<T>;
  loading: boolean;
  error: TNullable<string>;
  reload: () => void;
}

type Fetcher<T> = ((signal: AbortSignal) => Promise<T>) | (() => Promise<T>);

export function useFetch<T>(
  fetcher: Fetcher<T>,
  deps: React.DependencyList = [],
): UseFetchResult<T> {
  const [data, setData] = useState<T>(null as unknown as T);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<TNullable<string>>(null);
  const genRef = useRef(0);
  const controllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(() => {
    controllerRef.current?.abort();
    const gen = ++genRef.current;
    const controller = new AbortController();
    controllerRef.current = controller;
    setLoading(true);
    setError(null);

    fetcher(controller.signal)
      .then((result) => {
        if (gen === genRef.current) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (gen === genRef.current && !(err instanceof DOMException && err.name === "AbortError")) {
          setError(err instanceof Error ? err.message : "An error occurred");
          setLoading(false);
        }
      });
  }, deps);

  useEffect(() => {
    execute();
    return () => {
      genRef.current++;
      controllerRef.current?.abort();
    };
  }, [execute]);

  return { data, loading, error, reload: execute };
}
