import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

const DropdownMenu = (props) => <DropdownMenuPrimitive.Root {...props} />;
const DropdownMenuTrigger = (props) => <DropdownMenuPrimitive.Trigger {...props} />;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;

function DropdownMenuContent({ className, sideOffset = 6, ...props }) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[14rem] overflow-hidden rounded-2xl border bg-popover p-1.5 text-popover-foreground shadow-xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuItem({ className, variant = "default", ...props }) {
  return (
    <DropdownMenuPrimitive.Item
      data-variant={variant}
      className={cn(
        "relative flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-[15px] font-semibold outline-none select-none focus:bg-accent data-[disabled]:opacity-50 data-[variant=destructive]:text-destructive [&_svg]:size-5",
        className,
      )}
      {...props}
    />
  );
}

const DropdownMenuSeparator = ({ className, ...props }) => (
  <DropdownMenuPrimitive.Separator className={cn("mx-2 my-1 h-px bg-border", className)} {...props} />
);

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub };
