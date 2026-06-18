import axios from 'axios';

export const authConfig = {
  refreshEndpoint: '/auth/refresh',
  onSessionExpired: () => {
    window.location.href = '/login';
  }
};

let isRefreshing = false;
let failedQueue: { resolve: (v: unknown) => void; reject: (e: unknown) => void }[] = [];

export const api = axios.create({
  baseURL: 'https://gently-squeamish-chaffing.ngrok-free.dev/',
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status !== 401 || originalRequest._retry) {
      // If already retried and still 401 → session is dead
      if (originalRequest._retry && err.response?.status === 401) {
        authConfig.onSessionExpired();
      }
      return Promise.reject(err);
    }

    // Queue requests while refreshing
    if (isRefreshing) {
      return new Promise((resolve, reject) => failedQueue.push({ resolve, reject }))
        .then(() => api(originalRequest))
        .catch((e) => Promise.reject(e));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await axios.post(
        `${api.defaults.baseURL}${authConfig.refreshEndpoint}`,
        {},
        { withCredentials: true }
      );

      failedQueue.forEach((q) => q.resolve(undefined));
      failedQueue = [];
      return api(originalRequest);
    } catch {
      failedQueue.forEach((q) => q.reject(err));
      failedQueue = [];
      authConfig.onSessionExpired();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);
