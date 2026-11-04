import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router";
import AuthLayout from "@/layouts/AuthLayout";
import AuthFooterLink from "@/pages/Auth/AuthFooterLink";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { Message } from "@/components/ui/message";
import { Spinner } from "@/components/ui/spinner";
import { login } from "@/store/authSlice";
import { loginSchema } from "@/pages/Auth/schemas";
import { applyServerErrors, getErrorMessage } from "@/lib/utils";

export default function Login() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState("");
  const schema = useMemo(() => loginSchema(), [i18n.language]); // eslint-disable-line react-hooks/exhaustive-deps

  // message từ VerifyEmail / ResetPassword truyền qua route state
  const state = location.state || {};
  const info = state.verified ? t("auth.verified") : state.message;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), mode: "onTouched", defaultValues: { login: "", password: "" } });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await dispatch(login(data)).unwrap();
      navigate(state.from || "/", { replace: true });
    } catch (e) {
      if (!applyServerErrors(e, setError)) setServerError(getErrorMessage(e, t("common.error")));
    }
  };

  return (
    <AuthLayout title={t("auth.loginTitle")}>
      {info && !serverError && <Message type="success" className="mb-3">{info}</Message>}
      <Message type="error" className="mb-3">{serverError}</Message>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-2">
        <FormField placeholder={t("auth.loginField")} autoComplete="username" error={errors.login?.message} {...register("login")} />
        <FormField type="password" placeholder={t("auth.password")} autoComplete="current-password" error={errors.password?.message} {...register("password")} />
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Spinner className="text-primary-foreground" /> : t("auth.login")}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <Link to="/forgot-password" className="text-[15px] text-muted-foreground hover:underline">
          {t("auth.forgot")}
        </Link>
      </div>

      <AuthFooterLink text={t("auth.noAccount")} linkText={t("auth.register")} to="/register" />
    </AuthLayout>
  );
}
