import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const ACCESS_TOKEN_KEY = "finrelief_access_token";
export const REFRESH_TOKEN_KEY = "finrelief_refresh_token";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const tokenStorage = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

// --- Request interceptor: attach bearer token ---
api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Response interceptor: transparent refresh-on-401 with request queueing ---
let isRefreshing = false;
let pendingQueue = [];

function resolveQueue(error, token = null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isAuthEndpoint = originalRequest?.url?.includes("/auth/login") || originalRequest?.url?.includes("/auth/register");

    if (status !== 401 || isAuthEndpoint || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      tokenStorage.clear();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue this request until the in-flight refresh resolves.
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((newToken) => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refresh_token: refreshToken });
      tokenStorage.setTokens(data.access_token, data.refresh_token);
      resolveQueue(null, data.access_token);
      originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
      return api(originalRequest);
    } catch (refreshError) {
      resolveQueue(refreshError, null);
      tokenStorage.clear();
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

/**
 * Normalizes the backend's { success: false, error: { message, code, details } }
 * shape into a plain string, so components never have to parse error shapes.
 */
export function extractErrorMessage(error) {
  const data = error?.response?.data;
  if (data?.error?.message) return data.error.message;
  if (typeof data?.detail === "string") return data.detail;
  if (error?.message) return error.message;
  return "Something went wrong. Please try again.";
}

export default api;
