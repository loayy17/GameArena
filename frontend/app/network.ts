import axios, { type AxiosRequestConfig } from "axios";
import type { TEndpoint, TEndpointsMap, THashMap, TPromise, TProxy } from "@/domain/type/TCommon";
import type { IApiResponse } from "@/domain/meta/IApiResponse";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
const apiBase = API_BASE;
const baseURL = `${API_BASE}/api`;
let isRefreshing = false;
let queue: Array<{
  resolve: () => void;
  reject: (error: unknown) => void;
}> = [];

const api = axios.create({
  baseURL,
  withCredentials: true,
});

const flushQueue = (error?: unknown) => {
  queue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  queue = [];
};

const isAuthEndpoint = (url?: string) => {
  if (!url) return false;
  return ["/auth/login", "/auth/register", "/auth/refresh", "/auth/logout", "/auth/forgot-password", "/auth/reset-password"].some((endpoint) =>
    url.includes(endpoint),
  );
};

const redirectToLogin = () => {
  if (typeof window === "undefined") return;
  const authPages = ["/login", "/register", "/forgot-password", "/reset-password", "/email-verify"];
  if (!authPages.includes(window.location.pathname)) window.location.replace("/login");
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest?._retry || isAuthEndpoint(originalRequest?.url)) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({
          resolve: () => resolve(api(originalRequest)),
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      await api.post("/auth/refresh");
      flushQueue();
      return api(originalRequest);
    } catch (err) {
      flushQueue(err);
      redirectToLogin();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);

const buildUrl = (template: string, payload?: THashMap) => {
  if (payload == null) return { url: template, leftover: {} };

  if (typeof payload !== "object")
    return {
      url: template.replace(/\{0\}/g, encodeURIComponent(String(payload))),
      leftover: {},
    };

  let url = template;
  const leftover = { ...payload };
  for (const [key, value] of Object.entries(payload)) {
    const placeholder = `{${key}}`;
    if (!url.includes(placeholder)) continue;
    url = url.replace(placeholder, encodeURIComponent(`${value}`));
    delete leftover[key];
  }

  return { url, leftover };
};

async function request<Req, Res>(
  endpoint: TEndpoint,
  base: string,
  payload?: Req,
  config?: AxiosRequestConfig,
  resolver?: (data: unknown) => unknown,
): TPromise<Res> {
  const method = endpoint.verb.toLowerCase();
  const isMutation = ["post", "put", "patch"].includes(method);
  const { url, leftover } = buildUrl(endpoint.template, payload as THashMap);
  const hasLeftovers = Object.keys(leftover).length > 0;

  const requestBody = isMutation && hasLeftovers ? leftover : undefined;
  const requestQuery = !isMutation && hasLeftovers ? leftover : undefined;

  return api({
    method: endpoint.verb,
    url: base + url,
    ...(requestBody && { data: requestBody }),
    ...(requestQuery && { params: requestQuery }),
    ...config,
  }).then((res) => {
    const data = resolver ? resolver(res.data) : res.data;
    return data as IApiResponse<Res>;
  });
}

export function clientFactory<T extends TEndpointsMap>(
  base: string,
  endpoints: T,
  config?: AxiosRequestConfig,
  resolver?: (data: unknown) => unknown,
): { api: TProxy<T> } {
  const proxy = {} as TProxy<T>;
  for (const key in endpoints) {
    const endpoint = endpoints[key];
    proxy[key] = ((payload?: unknown, callConfig?: AxiosRequestConfig) =>
      request(endpoint, base, payload, { ...config, ...callConfig }, resolver)) as TProxy<T>[typeof key];
  }

  return { api: proxy };
}

export { request, buildUrl, api, apiBase, baseURL };
