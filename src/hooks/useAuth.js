import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { selectUser } from "@/store/authSlice";

/** requireAuth(fn): chưa đăng nhập thì chuyển /login, đã đăng nhập thì chạy fn */
export default function useAuth() {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const requireAuth = useCallback(
    (fn) =>
      (...args) => {
        if (!user) return navigate("/login");
        return fn?.(...args);
      },
    [user, navigate],
  );
  return { user, isLoggedIn: !!user, requireAuth };
}
