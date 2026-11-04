import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Toaster } from "sonner";
import AppRoutes from "@/routes";
import Logo from "@/components/layout/Logo";
import { clearUser, fetchCurrentUser, selectAuthStatus } from "@/store/authSlice";
import { setOnAuthFailed } from "@/lib/http";
import { tokenStorage } from "@/lib/token";

export default function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector(selectAuthStatus);
  const theme = useSelector((s) => s.ui.theme);

  useEffect(() => {
    // refresh token thất bại -> xoá user, về /login
    setOnAuthFailed(() => {
      dispatch(clearUser());
      navigate("/login", { replace: true });
    });
    if (tokenStorage.getAccess()) dispatch(fetchCurrentUser());
  }, [dispatch, navigate]);

  if (status === "loading") {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Logo className="size-14 animate-pulse" />
      </div>
    );
  }

  return (
    <>
      <AppRoutes />
      <Toaster position="bottom-center" theme={theme} richColors />
    </>
  );
}
