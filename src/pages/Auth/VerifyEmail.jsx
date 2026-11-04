import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import AuthLayout from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Message } from "@/components/ui/message";
import { Spinner } from "@/components/ui/spinner";
import authService from "@/services/authService";

export default function VerifyEmail() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | error
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return; // tránh gọi 2 lần ở StrictMode
    called.current = true;
    const token = params.get("token");
    if (!token) return setStatus("error");
    authService
      .verifyEmail(token)
      .then(() => navigate("/login", { replace: true, state: { verified: true } }))
      .catch(() => setStatus("error"));
  }, [params, navigate]);

  return (
    <AuthLayout>
      {status === "loading" ? (
        <div className="flex flex-col items-center gap-3 py-6">
          <Spinner className="size-8" />
          <p className="text-muted-foreground">{t("auth.verifying")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <Message type="error">{t("auth.invalidLink")}</Message>
          <Button size="lg" className="w-full" onClick={() => navigate("/login")}>
            {t("auth.goToLogin")}
          </Button>
        </div>
      )}
    </AuthLayout>
  );
}
