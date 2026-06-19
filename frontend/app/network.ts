import axios from "axios";

const api = axios.create({
  baseURL: "https://boxed-careful-marcus-plus.trycloudflare.com/api/",
  withCredentials: true,
});

let isRefreshing = false;
let queue: Array<{
  resolve: () => void;
  reject: (err: any) => void;
}> = [];

const flushQueue = (error?: any) => {
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
      original.url.includes("/auth/logout")
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
    } catch (err) {
      flushQueue(err);

      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/register"
      ) {
        window.location.replace("/login");
      }

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;

