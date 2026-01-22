import { cn } from "@/lib/utils"

function Skeleton({ pulse = true, className, ...props }: React.ComponentProps<"div"> & { pulse?: boolean }) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-muted rounded-md", pulse ? "animate-pulse" : "", className)}
      {...props}
    />
  )
}

export { Skeleton }
