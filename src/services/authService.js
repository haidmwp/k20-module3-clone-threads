import http from "@/lib/http";

const authService = {
  register: (data) =>
    http.post("/auth/register", data, {
      // để link xác thực trong email trỏ về frontend này
      headers: { "x-origin": location.origin + import.meta.env.BASE_URL.replace(/\/$/, "") },
    }),
  login: (data) => http.post("/auth/login", data),
  logout: () => http.post("/auth/logout"),
  getUser: () => http.get("/auth/user"),
  validateUsername: (username) => http.post("/auth/validate/username", { username }),
  validateEmail: (email) => http.post("/auth/validate/email", { email }),
  verifyEmail: (token) => http.post("/auth/verify-email", { token }),
  forgotPassword: (email) =>
    http.post("/auth/forgot-password", { email }, {
      headers: { "x-origin": location.origin + import.meta.env.BASE_URL.replace(/\/$/, "") },
    }),
  validateResetToken: (token) => http.get("/auth/reset-password/validate", { params: { token } }),
  resetPassword: (data) => http.post("/auth/reset-password", data),
};

export default authService;
