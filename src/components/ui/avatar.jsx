import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

function Avatar({ src, name = "", className }) {
  return (
    <AvatarPrimitive.Root className={cn("relative flex size-9 shrink-0 overflow-hidden rounded-full bg-muted", className)}>
      <AvatarPrimitive.Image src={src} alt={name} className="aspect-square size-full object-cover" />
      <AvatarPrimitive.Fallback className="flex size-full items-center justify-center text-sm font-semibold uppercase">
        {name?.[0] || "?"}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}

export { Avatar };
