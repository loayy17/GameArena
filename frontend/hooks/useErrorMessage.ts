"use client";

import { useCallback } from "react";
import { useTranslation } from "@/hooks/useSetting";
import { en, type TErrorMessages } from "@/component/i18n/ErrorCode/en.i18n";
import { ar } from "@/component/i18n/ErrorCode/ar.i18n";
import { fr } from "@/component/i18n/ErrorCode/fr.i18n";
import { ErrorCodeEnum } from "@/domain/enum/ErrorCodeEnum";
import type { AxiosError } from "axios";
import type { IApiResponse } from "@/domain/meta/IApiResponse";

export function toErrorCode(error: unknown): ErrorCodeEnum | undefined {
  return (error as AxiosError<IApiResponse<unknown>>)?.response?.data?.errorCode;
}

export function useErrorMessage() {
  const t = useTranslation({ en, ar, fr }) as TErrorMessages;
  return useCallback(
    (code: ErrorCodeEnum | undefined, fallback?: string): string => {
      if (code !== undefined && code in t) return t[code];
      return fallback ?? t[ErrorCodeEnum.ServerError];
    },
    [t],
  );
}
