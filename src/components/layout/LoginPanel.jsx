import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";

export default function LoginPanel() {
  const { t } = useTranslation();
  return (
    <aside className="fixed top-6 right-6 hidden w-[320px] lg:block">
      <Link
        to="/login"
        className="block rounded-2xl border bg-card p-6 text-center shadow-sm transition hover:bg-accent/50"
      >
        <h2 className="text-xl font-bold">{t("feed.loginToSee")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("feed.loginPanelDesc")}</p>
        <span className="mt-5 inline-flex items-center gap-1 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
          {t("auth.login")} <ChevronRight className="size-4" />
        </span>
      </Link>
    </aside>
  );
}
