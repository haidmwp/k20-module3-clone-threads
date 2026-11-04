import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** Input + message lỗi/hint dùng chung cho các form auth */
export function FormField({ error, hint, hintType = "muted", className, ...props }) {
  return (
    <div className={cn("space-y-1", className)}>
      <Input aria-invalid={!!error} {...props} />
      {error ? (
        <p className="px-1 text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className={cn("px-1 text-xs", hintType === "success" ? "text-green-600 dark:text-green-400" : "text-muted-foreground")}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
