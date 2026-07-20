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
  deps: ReadonlyArray<unknown> = [],
): UseFetchResult<T> {
  const [data, setData] = useState<T>(null as unknown as T);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<TNullable<string>>(null);
  const genRef = useRef(0);
  const controllerRef = useRef<AbortController | null>(null);
  const fetcherRef = useRef(fetcher);
  const mountedRef = useRef(false);

  useEffect(() => { fetcherRef.current = fetcher; }, [fetcher]);

  const execute = useCallback(() => {
    controllerRef.current?.abort();
    const gen = ++genRef.current;
    const controller = new AbortController();
    controllerRef.current = controller;
    setLoading(true);
    setError(null);

    fetcherRef.current(controller.signal)
      .then((result) => {
        if (gen === genRef.current && mountedRef.current) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (gen === genRef.current && mountedRef.current && !(err instanceof DOMException && err.name === "AbortError")) {
          setError(err instanceof Error ? err.message : "An error occurred");
          setLoading(false);
        }
      });
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    // Initial fetch - use timeout to avoid sync setState in effect
    const timer = setTimeout(() => {
      if (mountedRef.current) execute();
    }, 0);
    return () => {
      mountedRef.current = false;
      genRef.current++;
      controllerRef.current?.abort();
      clearTimeout(timer);
    };
  }, [execute, ...deps]);

  return { data, loading, error, reload: execute };
}
