"use client";

import { useCallback, useState } from "react";

import { toErrorCode, useErrorMessage } from "./useErrorMessage";

export function useAuthAction() {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const resolveError = useErrorMessage();

  const run = useCallback(
    async (action: () => Promise<void>, fallbackError: string) => {
      try {
        setLoading(true);
        setApiError("");
        await action();
      } catch (e: unknown) {
        setApiError(resolveError(toErrorCode(e), fallbackError));
      } finally {
        setLoading(false);
      }
    },
    [resolveError],
  );

  return { loading, apiError, run };
}
