const ACCESS = "access_token";
const REFRESH = "refresh_token";

export const tokenStorage = {
  getAccess: () => localStorage.getItem(ACCESS),
  getRefresh: () => localStorage.getItem(REFRESH),
  set({ access_token, refresh_token }) {
    if (access_token) localStorage.setItem(ACCESS, access_token);
    if (refresh_token) localStorage.setItem(REFRESH, refresh_token);
  },
  clear() {
    localStorage.removeItem(ACCESS);
    localStorage.removeItem(REFRESH);
  },
};

/** API có thể trả token ở data hoặc data.tokens */
export function extractTokens(payload) {
  const d = payload?.data ?? payload ?? {};
  const src = d.tokens ?? d;
  return {
    access_token: src.access_token ?? src.accessToken ?? src.token,
    refresh_token: src.refresh_token ?? src.refreshToken,
  };
}
