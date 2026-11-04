import axios from "axios";
import { tokenStorage, extractTokens } from "@/lib/token";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://threads.f8team.dev";

const http = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: { Accept: "application/json" },
});

// Đính kèm access token vào mọi request
http.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ===== Refresh token: gom các request bị 401 lại, refresh 1 lần rồi gửi lại =====
let refreshPromise = null;
let onAuthFailed = () => {};
export const setOnAuthFailed = (fn) => (onAuthFailed = fn);

const NO_REFRESH_URLS = ["/auth/login", "/auth/register", "/auth/refresh"];

async function refreshTokens() {
  const refresh_token = tokenStorage.getRefresh();
  // dùng axios thuần để không đi qua interceptor
  const res = await axios.post(`${API_BASE_URL}/api/auth/refresh`, { refresh_token }, {
    headers: { Accept: "application/json" },
  });
  const tokens = extractTokens(res.data);
  if (!tokens.access_token) throw new Error("Refresh failed");
  tokenStorage.set(tokens);
  return tokens.access_token;
}

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const skip = NO_REFRESH_URLS.some((u) => original?.url?.includes(u));

    if (status === 401 && !skip && !original._retry && tokenStorage.getRefresh()) {
      original._retry = true;
      try {
        refreshPromise ??= refreshTokens().finally(() => (refreshPromise = null));
        const newToken = await refreshPromise;
        original.headers.Authorization = `Bearer ${newToken}`;
        return http(original);
      } catch (e) {
        tokenStorage.clear();
        onAuthFailed();
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  },
);

export default http;
