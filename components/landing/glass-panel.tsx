import { cn } from "@/lib/utils"

type GlassPanelVariant = "default" | "bubble-left" | "bubble-right"

export type GlassPanelProps = {
  children: React.ReactNode
  variant?: GlassPanelVariant
  /** Applied to the outer wrapper (bg-background). Use for width so alignment (e.g. self-end) works. */
  wrapperClassName?: string
  className?: string
  innerClassName?: string
}

const gradientBorderClasses =
  "p-[1px] rounded-lg backdrop-blur-xl bg-gradient-to-b from-white/60 to-white/20"



export function GlassPanel({
  children,
  variant = "default",
  wrapperClassName,
  className,
  innerClassName,
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        "relative bg-background rounded-lg isolate [&>:first-child]:rounded-inherit",
        variant === "bubble-left" && "rounded-bl-none",
        variant === "bubble-right" && "rounded-br-none self-end",
        wrapperClassName,
        "before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:rounded-t-lg before:bg-gradient-to-r before:mx-auto before:from-transparent before:via-white/5 before:to-transparent before:pointer-events-none"
      )}
    >
      <div
        className={cn(
          "relative w-full",
          gradientBorderClasses,
          variant === "bubble-left" && "rounded-bl-none",
          variant === "bubble-right" && "rounded-br-none self-end",
          className
        )}
      >
        <div className={cn("p-3 space-y-4 h-full rounded-[calc(0.5rem-1px)]", innerClassName)}>
          {children}
        </div>
      </div>
    </div>
  )
}
