import { useState } from "react";
import { useTranslation } from "react-i18next";
import copy from "copy-to-clipboard";
import { toast } from "sonner";
import { Code, Image, Link2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import CopyImageModal from "@/components/post/CopyImageModal";
import EmbedModal from "@/components/post/EmbedModal";
import { appUrl, postPath } from "@/lib/utils";

export default function ShareMenu({ post, children }) {
  const { t } = useTranslation();
  const [openImage, setOpenImage] = useState(false);
  const [openEmbed, setOpenEmbed] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onSelect={() => {
              copy(appUrl(postPath(post)));
              toast.success(t("post.linkCopied"));
            }}
          >
            {t("post.copyLink")} <Link2 />
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setOpenImage(true)}>
            {t("post.copyImage")} <Image />
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setOpenEmbed(true)}>
            {t("post.embed")} <Code />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CopyImageModal open={openImage} onOpenChange={setOpenImage} post={post} />
      <EmbedModal open={openEmbed} onOpenChange={setOpenEmbed} post={post} />
    </>
  );
}
