import { cn } from "@/lib/utils";

const isVideo = (url = "") => /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url);

export default function PostMedia({ urls = [], className }) {
  if (!urls?.length) return null;
  return (
    <div className={cn("-mr-4 mt-2 flex snap-x gap-2 overflow-x-auto pr-4 [scrollbar-width:none]", className)}>
      {urls.map((url) =>
        isVideo(url) ? (
          <video key={url} src={url} controls className="max-h-[400px] shrink-0 snap-start rounded-xl border" />
        ) : (
          <img
            key={url}
            src={url}
            alt=""
            loading="lazy"
            className={cn(
              "shrink-0 snap-start rounded-xl border object-cover",
              urls.length === 1 ? "max-h-[430px] max-w-full" : "h-[250px] w-auto max-w-[280px]",
            )}
          />
        ),
      )}
    </div>
  );
}
