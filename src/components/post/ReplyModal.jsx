import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { AlignLeft, ImagePlay, Images, MapPin, Smile, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import QuotedPost from "@/components/post/QuotedPost";
import useAuth from "@/hooks/useAuth";
import postService from "@/services/postService";
import { getErrorMessage, timeAgo } from "@/lib/utils";

const schema = z.object({
  content: z.string().trim().min(1).max(500),
  topic: z.string().max(50).optional(),
});

const EMOJIS = ["😀", "😂", "🥰", "😍", "😎", "🤔", "😭", "😡", "👍", "👏", "🙏", "🔥", "❤️", "🎉", "💯", "✨", "😅", "🤣", "😢", "🥳"];
const REPLY_PERMISSIONS = [
  { value: "everyone", key: "post.anyone" },
  { value: "followers", key: "post.followers" },
  { value: "following", key: "post.followingOnly" },
  { value: "mentioned", key: "post.mentioned" },
];

/**
 * Modal soạn nội dung dùng chung:
 *  - mode="reply"  : trả lời post (mặc định)
 *  - mode="quote"  : trích dẫn post (QuoteModal tái sử dụng)
 *  - mode="create" : tạo thread mới
 *  - mode="edit"   : sửa post của mình
 */
export default function ReplyModal({ open, onOpenChange, post, mode = "reply", onSuccess }) {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [showTopic, setShowTopic] = useState(false);
  const [permission, setPermission] = useState("everyone");
  const fileRef = useRef(null);
  const gifRef = useRef(null);
  const textareaRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { content: "", topic: "" },
  });

  useEffect(() => {
    if (open) {
      reset({ content: mode === "edit" ? post?.content ?? "" : "", topic: "" });
      setFiles([]);
      setShowTopic(false);
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [open, mode, post, reset]);

  const previews = useMemo(() => files.map((f) => ({ file: f, url: URL.createObjectURL(f) })), [files]);
  useEffect(() => () => previews.forEach((p) => URL.revokeObjectURL(p.url)), [previews]);

  const content = watch("content");
  const { ref: contentRef, ...contentField } = register("content");

  const placeholder =
    mode === "quote"
      ? t("post.quotePlaceholder")
      : mode === "reply"
        ? t("post.replyTo", { username: post?.user?.username })
        : t("feed.whatsNew");

  const titles = { reply: t("post.comment"), quote: t("post.quote"), create: t("post.newThread"), edit: t("post.editPost") };

  const addFiles = (e) => {
    const list = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...list].slice(0, 10));
    e.target.value = "";
  };

  const insertEmoji = (emoji) => {
    const el = textareaRef.current;
    const value = getValues("content");
    const start = el?.selectionStart ?? value.length;
    const next = value.slice(0, start) + emoji + value.slice(el?.selectionEnd ?? start);
    setValue("content", next, { shouldValidate: true });
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(start + emoji.length, start + emoji.length);
    });
  };

  const onSubmit = async ({ content: text, topic }) => {
    const body = { content: topic ? `${text}\n#${topic.replace(/^#/, "")}` : text, media: files, reply_permission: permission };
    try {
      let res;
      if (mode === "reply") res = await postService.reply(post.id, body);
      else if (mode === "quote") res = await postService.quote(post.id, body);
      else if (mode === "edit") res = await postService.updatePost(post.id, body);
      else res = await postService.createPost(body);
      toast.success(t({ reply: "post.replied", quote: "post.quoted", edit: "post.updated", create: "post.created" }[mode]));
      onOpenChange(false);
      onSuccess?.(res.data?.data ?? res.data);
    } catch (e) {
      toast.error(getErrorMessage(e, t("common.error")));
    }
  };

  const ToolBtn = ({ icon: Icon, label, onClick }) => (
    <button type="button" aria-label={label} title={label} onClick={onClick} className="rounded-md p-1 text-muted-foreground transition hover:text-foreground">
      <Icon className="size-5" />
    </button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[620px] gap-0 p-0" showClose={false}>
        <div className="grid grid-cols-[80px_1fr_80px] items-center border-b px-4 py-3">
          <button className="text-left text-[15px]" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </button>
          <DialogTitle className="text-center">{titles[mode]}</DialogTitle>
          <span />
        </div>
        <DialogDescription className="sr-only">{placeholder}</DialogDescription>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="max-h-[65dvh] overflow-y-auto px-4 pt-4">
            {/* Post gốc khi reply */}
            {mode === "reply" && post && (
              <div className="flex gap-3 pb-3">
                <div className="flex flex-col items-center">
                  <Avatar src={post.user?.avatar_url} name={post.user?.username} />
                  <div className="mt-2 w-0.5 flex-1 bg-border" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex gap-2">
                    <span className="text-[15px] font-semibold">{post.user?.username}</span>
                    <span className="text-[15px] text-muted-foreground">{timeAgo(post.created_at, i18n.language)}</span>
                  </div>
                  <p className="text-[15px] whitespace-pre-wrap break-words">{post.content}</p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Avatar src={user?.avatar_url} name={user?.username} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-[15px]">
                  <span className="font-semibold">{user?.username}</span>
                  {showTopic ? (
                    <>
                      <span className="text-muted-foreground">›</span>
                      <input
                        {...register("topic")}
                        autoFocus
                        placeholder={t("post.addTopic")}
                        className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                      />
                    </>
                  ) : (
                    <button type="button" onClick={() => setShowTopic(true)} className="text-muted-foreground hover:text-foreground">
                      › {t("post.addTopic")}
                    </button>
                  )}
                </div>

                <Textarea
                  {...contentField}
                  ref={(el) => {
                    contentRef(el);
                    textareaRef.current = el;
                  }}
                  rows={2}
                  placeholder={placeholder}
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                />

                {previews.length > 0 && (
                  <div className="mt-2 flex gap-2 overflow-x-auto">
                    {previews.map((p, i) => (
                      <div key={p.url} className="relative shrink-0">
                        {p.file.type.startsWith("video") ? (
                          <video src={p.url} className="h-40 rounded-xl border" />
                        ) : (
                          <img src={p.url} alt="" className="h-40 rounded-xl border object-cover" />
                        )}
                        <button
                          type="button"
                          onClick={() => setFiles((f) => f.filter((_, idx) => idx !== i))}
                          className="absolute top-2 right-2 rounded-full bg-black/70 p-1 text-white"
                          aria-label="remove"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {mode === "quote" && <QuotedPost post={post} linkable={false} />}

                {/* Toolbar */}
                <div className="mt-2 flex items-center gap-3">
                  <ToolBtn icon={Images} label="Image / Video" onClick={() => fileRef.current?.click()} />
                  <ToolBtn icon={ImagePlay} label="GIF" onClick={() => gifRef.current?.click()} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button type="button" aria-label="Emoji" className="rounded-md p-1 text-muted-foreground hover:text-foreground">
                        <Smile className="size-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="grid min-w-0 grid-cols-5 gap-1 p-2">
                      {EMOJIS.map((e) => (
                        <DropdownMenuItem key={e} className="justify-center p-1.5 text-xl" onSelect={() => insertEmoji(e)}>
                          {e}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <ToolBtn icon={AlignLeft} label="Poll" onClick={() => toast.info(t("common.comingSoon"))} />
                  <ToolBtn icon={MapPin} label="Location" onClick={() => toast.info(t("common.comingSoon"))} />
                  <input ref={fileRef} type="file" accept="image/*,video/*" multiple hidden onChange={addFiles} />
                  <input ref={gifRef} type="file" accept="image/gif" hidden onChange={addFiles} />
                </div>
              </div>
            </div>

            {mode !== "edit" && (
              <button
                type="button"
                onClick={() => toast.info(t("common.comingSoon"))}
                className="mt-4 mb-2 flex items-center gap-3 text-[15px] text-muted-foreground"
              >
                <Avatar src={user?.avatar_url} name={user?.username} className="size-5 opacity-50" />
                {t("post.addToThread")}
              </button>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="text-left text-[15px] text-muted-foreground hover:text-foreground">
                  {t("post.replyOptions")}: {t(REPLY_PERMISSIONS.find((p) => p.value === permission).key)}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {REPLY_PERMISSIONS.map((p) => (
                  <DropdownMenuItem key={p.value} onSelect={() => setPermission(p.value)}>
                    {t(p.key)}
                    {permission === p.value && <span>✓</span>}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button type="submit" variant="outline" disabled={!isValid || !content?.trim() || isSubmitting} className="min-w-[72px]">
              {isSubmitting ? <Spinner className="size-4" /> : t("post.postBtn")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
