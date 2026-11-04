// API có thể đặt tên field trạng thái khác nhau -> gom về 1 chỗ
export const isLiked = (p) => !!(p?.is_liked ?? p?.liked_by_user ?? p?.liked ?? p?.is_liked_by_me ?? false);
export const isReposted = (p) => !!(p?.is_reposted ?? p?.reposted_by_user ?? p?.reposted ?? false);
export const isSaved = (p) => !!(p?.is_saved ?? p?.saved_by_user ?? p?.saved ?? false);

/** Gộp response của API (nếu có) vào post hiện tại */
export function mergeServerState(post, data, kind) {
  if (!data || typeof data !== "object") return post;
  const d = data.post ?? data;
  const next = { ...post };
  if (kind === "like") {
    const v = d.is_liked ?? d.liked;
    if (typeof v === "boolean") next.is_liked = v;
    if (typeof d.likes_count === "number") next.likes_count = d.likes_count;
  }
  if (kind === "repost") {
    const v = d.is_reposted ?? d.reposted;
    if (typeof v === "boolean") next.is_reposted = v;
    if (typeof d.reposts_and_quotes_count === "number") next.reposts_and_quotes_count = d.reposts_and_quotes_count;
  }
  if (kind === "save") {
    const v = d.is_saved ?? d.saved;
    if (typeof v === "boolean") next.is_saved = v;
  }
  return next;
}
