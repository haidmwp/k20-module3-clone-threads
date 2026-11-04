import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import EmbedLayout from "@/layouts/EmbedLayout";
import PostCard from "@/components/post/PostCard";
import Logo from "@/components/layout/Logo";
import { Spinner } from "@/components/ui/spinner";
import postService from "@/services/postService";
import { appUrl, postPath } from "@/lib/utils";

/** Route /:username/post/:postId/embed — chỉ PostCard nền trắng, dùng trong iframe */
export default function Embed() {
  const { postId } = useParams();
  const { t } = useTranslation();
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    postService
      .getPost(postId)
      .then((res) => {
        setPost(res.data?.data);
        setStatus("done");
      })
      .catch(() => setStatus("error"));
  }, [postId]);

  return (
    <EmbedLayout>
      {status === "loading" && (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      )}
      {status === "error" && <p className="p-6 text-center text-sm text-neutral-500">{t("post.notFound")}</p>}
      {post && (
        <PostCard
          post={post}
          readOnly
          className="border-b-0"
          footer={
            <a
              href={appUrl(postPath(post))}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-between border-t pt-3 text-sm font-semibold hover:underline"
            >
              {t("post.viewOnThreads")}
              <Logo className="size-5" />
            </a>
          }
        />
      )}
    </EmbedLayout>
  );
}
