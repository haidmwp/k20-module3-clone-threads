import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import postService from "@/services/postService";
import { getErrorMessage } from "@/lib/utils";

const REASONS = ["spam", "nudity", "hate_speech", "violence", "false_information", "bullying", "other"];

export default function ReportModal({ open, onOpenChange, post }) {
  const { t } = useTranslation();
  const [sending, setSending] = useState(null);

  const report = async (reason) => {
    setSending(reason);
    try {
      await postService.report(post.id, { reason });
      toast.success(t("post.reported"));
      onOpenChange(false);
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setSending(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-2">
        <DialogHeader>
          <DialogTitle className="text-destructive">{t("post.reportTitle")}</DialogTitle>
          <DialogDescription className="text-left font-semibold text-foreground">{t("post.reportDesc")}</DialogDescription>
        </DialogHeader>
        <div className="-mx-2">
          {REASONS.map((r) => (
            <button
              key={r}
              disabled={!!sending}
              onClick={() => report(r)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[15px] hover:bg-accent"
            >
              {t(`report.${r}`)}
              {sending === r ? <Spinner className="size-4" /> : <ChevronRight className="size-4 text-muted-foreground" />}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
