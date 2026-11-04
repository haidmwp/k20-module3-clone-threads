import { cn } from "@/lib/utils";

function Textarea({ className, ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full resize-none bg-transparent text-[15px] outline-none placeholder:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
