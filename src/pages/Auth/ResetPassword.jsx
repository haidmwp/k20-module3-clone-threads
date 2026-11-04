import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import AuthLayout from "@/layouts/AuthLayout";
import AuthFooterLink from "@/pages/Auth/AuthFooterLink";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { Message } from "@/components/ui/message";
import { Spinner } from "@/components/ui/spinner";
import authService from "@/services/authService";
import { resetSchema } from "@/pages/Auth/schemas";
import { applyServerErrors, getErrorMessage } from "@/lib/utils";

export default function ResetPassword() {
  const { t, i18n } = useTranslation();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token") || "";
  const [email, setEmail] = useState(params.get("email") || "");
  const [status, setStatus] = useState("checking"); // checking | valid | invalid
  const [serverError, setServerError] = useState("");
  const schema = useMemo(() => resetSchema(), [i18n.language]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!token) return setStatus("invalid");
    authService
      .validateResetToken(token)
      .then((res) => {
        const d = res.data?.data ?? {};
        if (d.valid === false) return setStatus("invalid");
        if (d.email) setEmail(d.email);
        setStatus("valid");
      })
      .catch(() => setStatus("invalid"));
  }, [token]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), mode: "onTouched", defaultValues: { password: "", password_confirmation: "" } });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await authService.resetPassword({ token, email, ...data });
      navigate("/login", { replace: true, state: { message: t("auth.resetSuccess") } });
    } catch (e) {
      if (!applyServerErrors(e, setError)) setServerError(getErrorMessage(e, t("common.error")));
    }
  };

  if (status === "checking") {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center gap-3 py-6">
          <Spinner className="size-8" />
          <p className="text-muted-foreground">{t("auth.checking")}</p>
        </div>
      </AuthLayout>
    );
  }

  if (status === "invalid") {
    return (
      <AuthLayout title={t("auth.resetTitle")}>
        <Message type="error">{t("auth.invalidLink")}</Message>
        <AuthFooterLink text="" linkText={t("auth.forgot")} to="/forgot-password" />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title={t("auth.resetTitle")}>
      <Message type="error" className="mb-3">{serverError || errors.email?.message || errors.token?.message}</Message>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-2">
        <FormField type="password" placeholder={t("auth.newPassword")} autoComplete="new-password" error={errors.password?.message} {...register("password")} />
        <FormField
          type="password"
          placeholder={t("auth.confirmPassword")}
          autoComplete="new-password"
          error={errors.password_confirmation?.message}
          {...register("password_confirmation")}
        />
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Spinner className="text-primary-foreground" /> : t("auth.resetTitle")}
        </Button>
      </form>
    </AuthLayout>
  );
}
