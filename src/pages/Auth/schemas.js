import { z } from "zod";
import i18n from "@/i18n";

const t = (k) => i18n.t(k);

export const passwordFields = () => ({
  password: z.string().min(1, t("validation.required")).min(8, t("validation.passwordMin")),
  password_confirmation: z.string().min(1, t("validation.required")),
});

export const matchPasswords = (d, ctx) => {
  if (d.password && d.password_confirmation && d.password !== d.password_confirmation) {
    ctx.addIssue({ code: "custom", path: ["password_confirmation"], message: t("validation.passwordMatch") });
  }
};

export const registerSchema = () =>
  z
    .object({
      username: z
        .string()
        .trim()
        .min(1, t("validation.required"))
        .regex(/^[a-zA-Z0-9._]{3,30}$/, t("validation.username")),
      email: z.string().trim().min(1, t("validation.required")).email(t("validation.email")),
      ...passwordFields(),
    })
    .superRefine(matchPasswords);

export const loginSchema = () =>
  z.object({
    login: z.string().trim().min(1, t("validation.required")),
    password: z.string().min(1, t("validation.required")),
  });

export const forgotSchema = () =>
  z.object({
    email: z.string().trim().min(1, t("validation.required")).email(t("validation.email")),
  });

export const resetSchema = () => z.object(passwordFields()).superRefine(matchPasswords);
