import { useState } from "react";
import { useTranslation } from "react-i18next";
import copy from "copy-to-clipboard";
import { toast } from "sonner";
import { Check, Copy } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { appUrl } from "@/lib/utils";

export function getEmbedSrc(post) {
  // location.origin + "/" + username + "/post/" + postId + "/embed" (có tính base path khi deploy GitHub Pages)
  return appUrl(`${post.user?.username}/post/${post.id}/embed`);
}

export function getEmbedCode(post) {
  return `<iframe src="${getEmbedSrc(post)}" width="550" height="400" style="border:1px solid #e5e5e5;border-radius:12px;max-width:100%" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`;
}

export default function EmbedModal({ open, onOpenChange, post }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  if (!post) return null;
  const code = getEmbedCode(post);

  const handleCopy = () => {
    copy(code);
    setCopied(true);
    toast.success(t("common.copied"));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("post.embedTitle")}</DialogTitle>
          <DialogDescription className="sr-only">{t("post.embed")}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center rounded-xl bg-muted/50 p-3">
          <iframe title="embed-preview" src={getEmbedSrc(post)} className="h-[360px] w-full max-w-[550px] rounded-xl border bg-white" />
        </div>
        <div className="flex items-center gap-2 rounded-xl border bg-secondary/60 p-2 pl-3">
          <code className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{code}</code>
          <Button size="sm" onClick={handleCopy}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {t("post.copyCode")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
