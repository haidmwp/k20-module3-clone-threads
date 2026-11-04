import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import PostCard from "@/components/post/PostCard";

/** Copy as image: render post vào khung trắng, dùng html-to-image chuyển DOM -> PNG rồi tải về */
export default function CopyImageModal({ open, onOpenChange, post }) {
  const { t } = useTranslation();
  const nodeRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const download = async () => {
    if (!nodeRef.current) return;
    setLoading(true);
    try {
      const dataUrl = await toPng(nodeRef.current, { cacheBust: true, pixelRatio: 2, backgroundColor: "#ffffff" });
      const link = document.createElement("a");
      link.download = `threads-${post.user?.username}-${post.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error(e);
      toast.error(t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  if (!post) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px]">
        <DialogHeader>
          <DialogTitle>{t("post.copyImage")}</DialogTitle>
          <DialogDescription className="sr-only">{t("post.copyImage")}</DialogDescription>
        </DialogHeader>
        <div className="rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-400 p-6 dark:from-neutral-700 dark:to-neutral-900">
          <div ref={nodeRef} className="theme-light rounded-2xl shadow-lg">
            <PostCard post={post} readOnly className="border-0" />
          </div>
        </div>
        <Button onClick={download} disabled={loading}>
          {loading ? <Spinner className="size-4 text-primary-foreground" /> : <Download className="size-4" />}
          {t("post.downloadImage")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
