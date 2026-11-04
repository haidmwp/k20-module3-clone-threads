import { useTranslation } from "react-i18next";
import DefaultLayout from "@/layouts/DefaultLayout";

export default function Placeholder({ titleKey }) {
  const { t } = useTranslation();
  return (
    <DefaultLayout title={t(titleKey)}>
      <div className="py-20 text-center text-muted-foreground md:rounded-3xl md:border md:bg-card">{t("common.comingSoon")}</div>
    </DefaultLayout>
  );
}
