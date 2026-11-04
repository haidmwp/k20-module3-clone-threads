import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import DefaultLayout from "@/layouts/DefaultLayout";
import PostCard from "@/components/post/PostCard";
import { Spinner } from "@/components/ui/spinner";
import { Message } from "@/components/ui/message";
import postService from "@/services/postService";
import { getErrorMessage } from "@/lib/utils";

/** Trang chi tiết post + danh sách comment (refresh sau khi reply) */
export default function PostDetail() {
  const { postId } = useParams();
  const { t } = useTranslation();
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReplies = useCallback(async () => {
    const res = await postService.getReplies(postId, { per_page: 50 });
    setReplies(res.data?.data ?? []);
  }, [postId]);

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([postService.getPost(postId), loadReplies()])
      .then(([res]) => setPost(res.data?.data ?? null))
      .catch((e) => setError(getErrorMessage(e, t("post.notFound"))))
      .finally(() => setLoading(false));
  }, [postId, loadReplies, t]);

  return (
    <DefaultLayout title="Thread">
      <div className="md:rounded-t-3xl md:border md:border-b-0 md:bg-card">
        {loading && (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        )}
        {error && <Message type="error" className="m-4">{error}</Message>}
        {post && (
          <>
            <PostCard post={post} clickable={false} onChange={setPost} onRemove={() => history.back()} onReplied={loadReplies} />
            <div className="border-b px-4 py-3 text-[15px] font-semibold">{t("post.replies")}</div>
            {replies.length === 0 && <p className="py-8 text-center text-muted-foreground">{t("post.noReplies")}</p>}
            {replies.map((r) => (
              <PostCard
                key={r.id}
                post={r}
                onChange={(u) => setReplies((l) => l.map((x) => (x.id === u.id ? u : x)))}
                onRemove={(id) => setReplies((l) => l.filter((x) => x.id !== id))}
              />
            ))}
          </>
        )}
      </div>
    </DefaultLayout>
  );
}
