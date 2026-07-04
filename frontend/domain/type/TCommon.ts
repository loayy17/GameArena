import type { IApiResponse } from "../meta/IApiResponse";

type TLocale = "en" | "ar";
type TTheme = "light" | "dark";
type THashMap<T = unknown> = Record<string, T>;
type TTranslate = { en: THashMap; ar: THashMap };
type TNullable<T> = T | null;
type TEndpointsMap = THashMap<TEndpoint>;
type TEndpoint = {
  verb: "get" | "post" | "put" | "delete";
  template: string;
};
type TFieldLogin = "email" | "password";

type TPromise<T> = Promise<IApiResponse<T>>;
type TProxy<T extends TEndpointsMap> = {
  [K in keyof T]: <TResult = unknown, TReq = unknown>(
    payload?: TReq,
  ) => TPromise<TResult>;
};
export type {
  TLocale,
  TTheme,
  THashMap,
  TTranslate,
  TNullable,
  TEndpointsMap,
  TEndpoint,
  TFieldLogin,
  TPromise,
  TProxy,
};
