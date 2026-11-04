import { useState } from "react";
import { useTranslation } from "react-i18next";
import copy from "copy-to-clipboard";
import { toast } from "sonner";
import { Bookmark, BookmarkMinus, Ban, EyeOff, Flag, Link2, MoreHorizontal, Pencil, Trash2, UserMinus, VolumeX } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ConfirmDialog from "@/components/post/ConfirmDialog";
import ReportModal from "@/components/post/ReportModal";
import ReplyModal from "@/components/post/ReplyModal";
import useAuth from "@/hooks/useAuth";
import postService from "@/services/postService";
import { isSaved, mergeServerState } from "@/lib/post";
import { appUrl, getErrorMessage, postPath } from "@/lib/utils";

export default function PostMenu({ post, onChange, onRemove }) {
  const { t } = useTranslation();
  const { user, requireAuth } = useAuth();
  const [confirm, setConfirm] = useState(null); // "block" | "delete"
  const [openReport, setOpenReport] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const isOwner = user && post.user_id === user.id;
  const saved = isSaved(post);

  const run = async (fn, successMsg, after) => {
    try {
      const res = await fn();
      if (successMsg) toast.success(successMsg);
      after?.(res);
    } catch (e) {
      toast.error(getErrorMessage(e, t("common.error")));
    }
  };

  const handleSave = async () => {
    const optimistic = { ...post, is_saved: !saved };
    onChange?.(optimistic);
    try {
      const res = await postService.toggleSave(post.id);
      onChange?.(mergeServerState(optimistic, res.data?.data, "save"));
      toast.success(saved ? t("post.unsaved") : t("post.saved"));
    } catch (e) {
      onChange?.(post); // rollback
      toast.error(getErrorMessage(e, t("common.error")));
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button aria-label="More" onClick={(e) => e.stopPropagation()} className="rounded-full p-1.5 text-muted-foreground transition hover:bg-accent">
            <MoreHorizontal className="size-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuItem onSelect={requireAuth(handleSave)}>
            {saved ? t("post.unsave") : t("post.save")} {saved ? <BookmarkMinus /> : <Bookmark />}
          </DropdownMenuItem>
          {!isOwner && (
            <DropdownMenuItem onSelect={requireAuth(() => run(() => postService.hide(post.id), t("post.hidden"), () => onRemove?.(post.id)))}>
              {t("post.notInterested")} <EyeOff />
            </DropdownMenuItem>
          )}

          {isOwner ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setOpenEdit(true)}>
                {t("post.edit")} <Pencil />
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onSelect={() => setConfirm("delete")}>
                {t("post.delete")} <Trash2 />
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={requireAuth(() => run(() => postService.muteUser(post.user_id), t("post.muted")))}>
                {t("post.mute")} <VolumeX />
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={requireAuth(() => run(() => postService.restrictUser(post.user_id), t("post.restricted")))}>
                {t("post.restrict")} <UserMinus />
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onSelect={requireAuth(() => setConfirm("block"))}>
                {t("post.block")} <Ban />
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onSelect={requireAuth(() => setOpenReport(true))}>
                {t("post.report")} <Flag />
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => {
              copy(appUrl(postPath(post)));
              toast.success(t("post.linkCopied"));
            }}
          >
            {t("post.copyLink")} <Link2 />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={confirm === "block"}
        onOpenChange={(o) => !o && setConfirm(null)}
        title={t("post.blockTitle", { username: post.user?.username })}
        description={t("post.blockDesc")}
        confirmText={t("post.block")}
        onConfirm={() => run(() => postService.blockUser(post.user_id), t("post.blocked"), () => onRemove?.(post.id))}
      />
      <ConfirmDialog
        open={confirm === "delete"}
        onOpenChange={(o) => !o && setConfirm(null)}
        title={t("post.deleteTitle")}
        description={t("post.deleteDesc")}
        confirmText={t("post.delete")}
        onConfirm={() => run(() => postService.deletePost(post.id), t("post.deleted"), () => onRemove?.(post.id))}
      />
      <ReportModal open={openReport} onOpenChange={setOpenReport} post={post} />
      <ReplyModal
        open={openEdit}
        onOpenChange={setOpenEdit}
        mode="edit"
        post={post}
        onSuccess={(updated) => onChange?.({ ...post, ...(updated?.id ? updated : {}), content: updated?.content ?? post.content })}
      />
    </>
  );
}
