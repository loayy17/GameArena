import type { AxiosRequestConfig } from "axios";
import type { HttpVerbEnum } from "../enum/HttpVerbEnum";
import type { IApiResponse } from "../meta/IApiResponse";
type THashMap<T = unknown, K extends string | number | symbol = string | number | symbol> = Record<K, T>;
type TTranslate = { en: THashMap; ar: THashMap; fr: THashMap };
type TNullable<T> = T | null;
type TOptional<T> = T | undefined;
type TEndpointsMap = THashMap<TEndpoint>;
type TEndpoint = {
  verb: HttpVerbEnum;
  template: string;
};

type TPromise<T> = Promise<IApiResponse<T>>;
type TProxy<T extends TEndpointsMap> = {
  [K in keyof T]: <TResult = unknown, TReq = unknown>(payload?: TReq, config?: AxiosRequestConfig) => TPromise<TResult>;
};
export type { THashMap, TTranslate, TNullable, TEndpointsMap, TEndpoint, TPromise, TProxy, TOptional };
