import axios, { AxiosRequestConfig } from "axios";
import type {
  TEndpoint,
  TEndpointsMap,
  THashMap,
  TPromise,
  TProxy,
} from "@/domain/type/TCommon";
import type { IApiResponse } from "@/domain/meta/IApiResponse";

export const baseURL = "https://gamearena-ppnc.onrender.com/api/";

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

let isRefreshing = false;

let queue: Array<{
  resolve: () => void;
  reject: (err: THashMap) => void;
}> = [];

const flushQueue = (error?: THashMap) => {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve()));
  queue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (
      error.response?.status !== 401 ||
      original._retry ||
      original.url.includes("/auth/login") ||
      original.url.includes("/auth/register") ||
      original.url.includes("/auth/refresh") ||
      original.url.includes("/auth/logout") ||
      original.url.includes("/auth/forgot-password") ||
      original.url.includes("/auth/reset-password")
    ) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({
          resolve: () => resolve(api(original)),
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      await api.post("/auth/refresh");

      flushQueue();

      return api(original);
    } catch (err: unknown) {
      flushQueue(err as THashMap);

      if (
        typeof window !== "undefined" &&
        !["/login", "/register"].includes(window.location.pathname)
      ) {
        window.location.replace("/login");
      }

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);

/* ---------------- URL ---------------- */

export function buildUrl(template: string, payload?: THashMap) {
  if (payload == null) return { url: template, leftover: {} };

  if (typeof payload !== "object") {
    return {
      url: template.replace(/\{0\}/g, encodeURIComponent(String(payload))),
      leftover: {},
    };
  }

  let formattedUrl = template;
  const leftover = { ...payload };

  for (const [key, value] of Object.entries(payload)) {
    const placeholder = `{${key}}`;

    if (formattedUrl.includes(placeholder)) {
      formattedUrl = formattedUrl.replace(
        placeholder,
        encodeURIComponent(`${value}`),
      );
      delete leftover[key];
    }
  }

  return { url: formattedUrl, leftover };
}

/* ---------------- REQUEST ---------------- */

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

/* ---------------- CLIENT FACTORY ---------------- */

export function clientFactory<T extends TEndpointsMap>(
  base: string,
  endpoints: T,
  config?: AxiosRequestConfig,
  resolver?: (data: unknown) => unknown,
) {
  const proxy = {} as TProxy<T>;

  for (const key in endpoints) {
    const endpoint = endpoints[key];

    proxy[key] = ((payload?: unknown) =>
      request(
        endpoint,
        base,
        payload,
        config,
        resolver,
      )) as TProxy<T>[typeof key];
  }

  return { api: proxy };
}
