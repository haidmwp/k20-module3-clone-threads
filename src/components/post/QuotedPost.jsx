import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Avatar } from "@/components/ui/avatar";
import PostMedia from "@/components/post/PostMedia";
import { postPath, timeAgo } from "@/lib/utils";

/** Khung hiển thị post được quote (dùng trong PostCard và QuoteModal) */
export default function QuotedPost({ post, linkable = true }) {
  const { i18n } = useTranslation();
  if (!post) return null;
  const body = (
    <div className="mt-2 rounded-xl border p-3 transition hover:bg-accent/40">
      <div className="flex items-center gap-2">
        <Avatar src={post.user?.avatar_url} name={post.user?.username} className="size-5" />
        <span className="text-sm font-semibold">{post.user?.username}</span>
        <span className="text-sm text-muted-foreground">{timeAgo(post.created_at, i18n.language)}</span>
      </div>
      {post.content && <p className="mt-1 text-[15px] whitespace-pre-wrap break-words">{post.content}</p>}
      <PostMedia urls={post.media_urls} className="mr-0 pr-0" />
    </div>
  );
  return linkable ? (
    <Link to={postPath(post)} onClick={(e) => e.stopPropagation()} className="block">
      {body}
    </Link>
  ) : (
    body
  );
}
