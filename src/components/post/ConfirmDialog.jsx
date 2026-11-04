import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

export default function ConfirmDialog({ open, onOpenChange, title, description, confirmText, onConfirm, destructive = true }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const handle = async () => {
    setLoading(true);
    try {
      await onConfirm?.();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showClose={false} className="max-w-[300px] gap-0 p-0">
        <DialogHeader className="p-6">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="grid grid-cols-2 border-t">
          <button className="border-r py-4 text-[15px] font-semibold hover:bg-accent" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </button>
          <button
            disabled={loading}
            onClick={handle}
            className={`flex items-center justify-center py-4 text-[15px] font-bold hover:bg-accent ${destructive ? "text-destructive" : ""}`}
          >
            {loading ? <Spinner className="size-4" /> : confirmText}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
