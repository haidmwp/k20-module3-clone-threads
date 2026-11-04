import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Heart, MessageCircle, Quote, Repeat2, Send } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ReplyModal from "@/components/post/ReplyModal";
import QuoteModal from "@/components/post/QuoteModal";
import ShareMenu from "@/components/post/ShareMenu";
import useAuth from "@/hooks/useAuth";
import postService from "@/services/postService";
import { isLiked, isReposted, mergeServerState } from "@/lib/post";
import { cn, formatCount, getErrorMessage } from "@/lib/utils";

const btn = "flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[13px] text-muted-foreground transition hover:bg-accent";

export default function InteractionBar({ post, onChange, onReplied, readOnly = false }) {
  const { t } = useTranslation();
  const { requireAuth } = useAuth();
  const [openReply, setOpenReply] = useState(false);
  const [openQuote, setOpenQuote] = useState(false);
  const liked = isLiked(post);
  const reposted = isReposted(post);

  // Optimistic update + rollback khi lỗi
  const handleLike = async () => {
    const prev = post;
    const optimistic = { ...post, is_liked: !liked, likes_count: Math.max(0, (post.likes_count || 0) + (liked ? -1 : 1)) };
    onChange?.(optimistic);
    try {
      const res = await postService.toggleLike(post.id);
      onChange?.(mergeServerState(optimistic, res.data?.data, "like"));
    } catch (e) {
      onChange?.(prev);
      toast.error(getErrorMessage(e, t("common.error")));
    }
  };

  const handleRepost = async () => {
    const prev = post;
    const optimistic = {
      ...post,
      is_reposted: !reposted,
      reposts_and_quotes_count: Math.max(0, (post.reposts_and_quotes_count || 0) + (reposted ? -1 : 1)),
    };
    onChange?.(optimistic);
    try {
      const res = await postService.toggleRepost(post.id);
      onChange?.(mergeServerState(optimistic, res.data?.data, "repost"));
      toast.success(reposted ? t("post.unreposted") : t("post.reposted"));
    } catch (e) {
      onChange?.(prev);
      toast.error(getErrorMessage(e, t("common.error")));
    }
  };

  if (readOnly) {
    return (
      <div className="-ml-2.5 mt-1.5 flex items-center">
        <span className={btn}><Heart className="size-[19px]" /> {formatCount(post.likes_count)}</span>
        <span className={btn}><MessageCircle className="size-[19px]" /> {formatCount(post.replies_count)}</span>
        <span className={btn}><Repeat2 className="size-[19px]" /> {formatCount(post.reposts_and_quotes_count)}</span>
        <span className={btn}><Send className="size-[19px]" /></span>
      </div>
    );
  }

  return (
    <div className="-ml-2.5 mt-1.5 flex items-center" onClick={(e) => e.stopPropagation()}>
      <button aria-label={t("post.like")} aria-pressed={liked} onClick={requireAuth(handleLike)} className={cn(btn, liked && "text-red-500")}>
        <Heart className={cn("size-[19px]", liked && "fill-red-500 text-red-500")} />
        {formatCount(post.likes_count)}
      </button>

      <button aria-label={t("post.comment")} onClick={requireAuth(() => setOpenReply(true))} className={btn}>
        <MessageCircle className="size-[19px]" />
        {formatCount(post.replies_count)}
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button aria-label={t("post.repost")} className={cn(btn, reposted && "text-green-600 dark:text-green-500")}>
            <Repeat2 className="size-[19px]" />
            {formatCount(post.reposts_and_quotes_count)}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onSelect={requireAuth(handleRepost)} variant={reposted ? "destructive" : "default"}>
            {reposted ? t("post.removeRepost") : t("post.repost")} <Repeat2 />
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={requireAuth(() => setOpenQuote(true))}>
            {t("post.quote")} <Quote />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ShareMenu post={post}>
        <button aria-label={t("post.share")} className={btn}>
          <Send className="size-[19px]" />
        </button>
      </ShareMenu>

      <ReplyModal
        open={openReply}
        onOpenChange={setOpenReply}
        post={post}
        onSuccess={(reply) => {
          onChange?.({ ...post, replies_count: (post.replies_count || 0) + 1 });
          onReplied?.(reply);
        }}
      />
      <QuoteModal
        open={openQuote}
        onOpenChange={setOpenQuote}
        post={post}
        onSuccess={() => onChange?.({ ...post, reposts_and_quotes_count: (post.reposts_and_quotes_count || 0) + 1 })}
      />
    </div>
  );
}
