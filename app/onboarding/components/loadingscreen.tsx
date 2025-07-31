import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
export function LoadingScreen({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn(className, "overlay")} {...props}>
      <Button
        size="sm"
        disabled
        className="disabled:opacity-100 dark:bg-[#252525] text-[#9b9999] py-5 px-11 h-12 w-36 text-xs"
      >
        Getting ready
        <Loader2Icon className="animate-spin" />
      </Button>
    </div>
  );
}
