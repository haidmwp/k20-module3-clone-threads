import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DefaultLayout from "@/layouts/DefaultLayout";
import PostCard from "@/components/post/PostCard";
import ReplyModal from "@/components/post/ReplyModal";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import useAuth from "@/hooks/useAuth";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import postService from "@/services/postService";
import { cn, getErrorMessage } from "@/lib/utils";

const TABS = [
  { value: "for_you", key: "feed.forYou" },
  { value: "following", key: "feed.following" },
  { value: "ghost", key: "feed.ghost" },
];

export default function Home() {
  const { t } = useTranslation();
  const { user, isLoggedIn, requireAuth } = useAuth();
  const [tab, setTab] = useState("for_you");
  const [openCreate, setOpenCreate] = useState(false);

  const fetchPage = useCallback(
    async (page) => {
      const res = await postService.getFeed({ type: tab, page, per_page: 10 });
      return { items: res.data?.data ?? [], lastPage: res.data?.pagination?.last_page ?? page };
    },
    [tab],
  );

  const { items, setItems, loading, hasMore, error, sentinelRef, refresh, retry } = useInfiniteScroll(fetchPage, [fetchPage, user?.id]);

  // tạo post mới từ Sidebar -> refresh feed
  useEffect(() => {
    window.addEventListener("post:created", refresh);
    return () => window.removeEventListener("post:created", refresh);
  }, [refresh]);

  const updatePost = (updated) => setItems((list) => list.map((p) => (p.id === updated.id ? updated : p)));
  const removePost = (id) => setItems((list) => list.filter((p) => p.id !== id));

  return (
    <DefaultLayout>
      {/* Tabs */}
      <div className="sticky top-0 z-10 grid grid-cols-3 border-b bg-background/90 backdrop-blur">
        {TABS.map((it) => (
          <button
            key={it.value}
            onClick={it.value === "for_you" ? () => setTab(it.value) : requireAuth(() => setTab(it.value))}
            className={cn(
              "relative py-4 text-[15px] font-semibold transition",
              tab === it.value ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t(it.key)}
            {tab === it.value && <span className="absolute inset-x-6 bottom-0 h-px bg-foreground" />}
          </button>
        ))}
      </div>

      <div className="md:mt-3 md:rounded-t-3xl md:border md:border-b-0 md:bg-card">
        {isLoggedIn && (
          <div className="flex items-center gap-3 border-b px-4 py-4">
            <Avatar src={user?.avatar_url} name={user?.username} />
            <button onClick={() => setOpenCreate(true)} className="flex-1 text-left text-[15px] text-muted-foreground">
              {t("feed.whatsNew")}
            </button>
            <Button variant="outline" size="sm" onClick={() => setOpenCreate(true)}>
              {t("feed.post")}
            </Button>
          </div>
        )}

        {items.map((post) => (
          <PostCard key={post.id} post={post} onChange={updatePost} onRemove={removePost} />
        ))}

        {loading && (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center gap-2 py-6 text-sm text-destructive">
            {getErrorMessage(error, t("common.error"))}
            <Button variant="outline" size="sm" onClick={retry}>
              {t("common.retry")}
            </Button>
          </div>
        )}
        {!loading && !error && items.length === 0 && <p className="py-10 text-center text-muted-foreground">{t("common.empty")}</p>}
        {!loading && !hasMore && items.length > 0 && <p className="py-6 text-center text-sm text-muted-foreground">{t("common.noMore")}</p>}
        <div ref={sentinelRef} className="h-1" />
      </div>

      <ReplyModal open={openCreate} onOpenChange={setOpenCreate} mode="create" onSuccess={refresh} />
    </DefaultLayout>
  );
}
