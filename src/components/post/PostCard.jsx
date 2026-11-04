import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Avatar } from "@/components/ui/avatar";
import InteractionBar from "@/components/post/InteractionBar";
import PostMenu from "@/components/post/PostMenu";
import PostMedia from "@/components/post/PostMedia";
import QuotedPost from "@/components/post/QuotedPost";
import { cn, postPath, timeAgo } from "@/lib/utils";

/**
 * props:
 *  - onChange(updatedPost): cập nhật post trong list (like, repost, save, edit...)
 *  - onRemove(id): xoá post khỏi list (delete, block, not interested)
 *  - readOnly: chỉ hiển thị (dùng cho Copy as image / Embed)
 */
export default function PostCard({ post, onChange, onRemove, onReplied, readOnly = false, clickable = true, footer, className }) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  if (!post) return null;
  const { user } = post;

  const openDetail = (e) => {
    if (readOnly || !clickable) return;
    if (e.target.closest("a,button,[role=menuitem],video")) return;
    if (window.getSelection()?.toString()) return;
    navigate(postPath(post));
  };

  const UserLink = readOnly ? "span" : Link;
  const linkProps = readOnly ? {} : { to: postPath(post) };

  return (
    <article
      onClick={openDetail}
      className={cn("flex gap-3 border-b px-4 py-3", !readOnly && clickable && "cursor-pointer", className)}
    >
      <div className="shrink-0 pt-1">
        <Avatar src={user?.avatar_url} name={user?.username} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5 text-[15px]">
            <UserLink {...linkProps} className="truncate font-semibold hover:underline">
              {user?.username}
            </UserLink>
            {user?.verified && <span className="text-blue-500">✔</span>}
            <time dateTime={post.created_at} title={new Date(post.created_at).toLocaleString()} className="shrink-0 text-muted-foreground">
              {timeAgo(post.created_at, i18n.language)}
            </time>
          </div>
          {!readOnly && <PostMenu post={post} onChange={onChange} onRemove={onRemove} />}
        </div>

        {post.content && <p className="mt-0.5 text-[15px] leading-snug whitespace-pre-wrap break-words">{post.content}</p>}
        <PostMedia urls={post.media_urls} />
        {post.is_quote && post.original_post && <QuotedPost post={post.original_post} linkable={!readOnly} />}

        <InteractionBar post={post} onChange={onChange} onReplied={onReplied} readOnly={readOnly} />
        {footer}
      </div>
    </article>
  );
}
