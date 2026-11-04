import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import AuthLayout from "@/layouts/AuthLayout";
import AuthFooterLink from "@/pages/Auth/AuthFooterLink";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { Message } from "@/components/ui/message";
import { Spinner } from "@/components/ui/spinner";
import authService from "@/services/authService";
import { forgotSchema } from "@/pages/Auth/schemas";
import { applyServerErrors, getErrorMessage } from "@/lib/utils";

export default function ForgotPassword() {
  const { t, i18n } = useTranslation();
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState("");
  const schema = useMemo(() => forgotSchema(), [i18n.language]); // eslint-disable-line react-hooks/exhaustive-deps

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), mode: "onTouched", defaultValues: { email: "" } });

  const onSubmit = async ({ email }) => {
    setServerError("");
    setSent(false);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (e) {
      if (!applyServerErrors(e, setError)) setServerError(getErrorMessage(e, t("common.error")));
    }
  };

  return (
    <AuthLayout title={t("auth.forgotTitle")}>
      <p className="mb-4 text-center text-[15px] text-muted-foreground">{t("auth.forgotDesc")}</p>
      {sent && <Message type="info" className="mb-3">{t("auth.forgotSuccess")}</Message>}
      <Message type="error" className="mb-3">{serverError}</Message>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-2">
        <FormField type="email" placeholder={t("auth.email")} autoComplete="email" error={errors.email?.message} {...register("email")} />
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Spinner className="text-primary-foreground" /> : t("auth.sendLink")}
        </Button>
      </form>

      <AuthFooterLink text="" linkText={t("auth.backToLogin")} to="/login" />
    </AuthLayout>
  );
}
