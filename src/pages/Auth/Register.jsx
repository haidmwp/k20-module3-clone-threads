import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import AuthLayout from "@/layouts/AuthLayout";
import AuthFooterLink from "@/pages/Auth/AuthFooterLink";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { Message } from "@/components/ui/message";
import { Spinner } from "@/components/ui/spinner";
import useDebounce from "@/hooks/useDebounce";
import authService from "@/services/authService";
import { registerSchema } from "@/pages/Auth/schemas";
import { applyServerErrors, getErrorMessage } from "@/lib/utils";

const DEBOUNCE_MS = 700;

/** Kiểm tra username/email đã tồn tại sau khi ngừng gõ (debounce) */
function useAvailability(value, isFormatValid, check, takenMsg, field, setError, clearErrors) {
  const debounced = useDebounce(value, DEBOUNCE_MS);
  const [state, setState] = useState("idle"); // idle | checking | available | taken

  useEffect(() => {
    if (!debounced || !isFormatValid) return setState("idle");
    let cancelled = false;
    setState("checking");
    check(debounced)
      .then((res) => {
        if (cancelled) return;
        const available = res.data?.data?.available;
        if (available === false) {
          setState("taken");
          setError(field, { type: "taken", message: takenMsg });
        } else {
          setState("available");
          clearErrors(field);
        }
      })
      .catch(() => !cancelled && setState("idle"));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced, isFormatValid]);

  return state;
}

export default function Register() {
  const { t, i18n } = useTranslation();
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const schema = useMemo(() => registerSchema(), [i18n.language]); // eslint-disable-line react-hooks/exhaustive-deps

  const {
    register,
    handleSubmit,
    control,
    setError,
    clearErrors,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { username: "", email: "", password: "", password_confirmation: "" },
  });

  const [username, email] = useWatch({ control, name: ["username", "email"] });
  const usernameOk = /^[a-zA-Z0-9._]{3,30}$/.test(username?.trim() || "");
  const emailOk = /^\S+@\S+\.\S+$/.test(email || "");

  const usernameState = useAvailability(username?.trim(), usernameOk, authService.validateUsername, t("auth.usernameTaken"), "username", setError, clearErrors);
  const emailState = useAvailability(email?.trim(), emailOk, authService.validateEmail, t("auth.emailTaken"), "email", setError, clearErrors);

  const onSubmit = async (data) => {
    setServerError("");
    if (usernameState === "taken") return setError("username", { message: t("auth.usernameTaken") });
    if (emailState === "taken") return setError("email", { message: t("auth.emailTaken") });
    try {
      await authService.register(data);
      setSuccess(true);
      reset();
    } catch (e) {
      // 422 -> map lỗi từng field; lỗi khác -> hiển thị chung
      if (!applyServerErrors(e, setError)) setServerError(getErrorMessage(e, t("common.error")));
    }
  };

  const hint = (state) =>
    state === "checking" ? t("common.loading") : state === "available" ? t("auth.available") : undefined;

  return (
    <AuthLayout title={t("auth.registerTitle")}>
      {success && <Message type="success" className="mb-3">{t("auth.registerSuccess")}</Message>}
      <Message type="error" className="mb-3">{serverError}</Message>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-2">
        <FormField
          placeholder={t("auth.displayName")}
          autoComplete="username"
          error={errors.username?.message}
          hint={hint(usernameState)}
          hintType={usernameState === "available" ? "success" : "muted"}
          {...register("username")}
        />
        <FormField
          type="email"
          placeholder={t("auth.email")}
          autoComplete="email"
          error={errors.email?.message}
          hint={hint(emailState)}
          hintType={emailState === "available" ? "success" : "muted"}
          {...register("email")}
        />
        <FormField type="password" placeholder={t("auth.password")} autoComplete="new-password" error={errors.password?.message} {...register("password")} />
        <FormField
          type="password"
          placeholder={t("auth.confirmPassword")}
          autoComplete="new-password"
          error={errors.password_confirmation?.message}
          {...register("password_confirmation")}
        />
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Spinner className="text-primary-foreground" /> : t("auth.register")}
        </Button>
      </form>

      <AuthFooterLink text={t("auth.hasAccount")} linkText={t("auth.login")} to="/login" />
    </AuthLayout>
  );
}
