import { cn } from "@/lib/utils";

/** Thông báo inline: type = info | success | error */
export function Message({ type = "info", children, className }) {
  if (!children) return null;
  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={cn(
        "rounded-xl border px-4 py-3 text-sm",
        type === "error" && "border-destructive/40 bg-destructive/10 text-destructive",
        type === "success" && "border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-400",
        type === "info" && "border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-400",
        className,
      )}
    >
      {children}
    </div>
  );
}
