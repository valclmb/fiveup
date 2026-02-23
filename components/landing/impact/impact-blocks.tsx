import { Pills } from "@/components/custom-ui/pills"
import { GlassPanel } from "@/components/landing/glass-panel"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  MessagesSquare,
  RefreshCw,
  Star,
  Truck
} from "lucide-react"
import Image from "next/image"

const Bubble = ({ variant = "left", size = "default" }: { variant?: "left" | "right", size?: "default" | "sm" }) => (
  <GlassPanel
    variant={variant === "left" ? "bubble-left" : "bubble-right"}
    wrapperClassName="w-7/12"
    className="opacity-[0.05]"
    innerClassName={cn(size === "sm" && "space-y-2")}
  >
    <div className={cn("w-1/2 h-4 bg-white rounded-xl", size === "sm" ? "h-2.5" : "h-4")} />
    <div className={cn("w-full h-2.5 bg-white rounded-xl", size === "sm" ? "h-2" : "h-2.5")} />
  </GlassPanel>
)

export const ImpactReviewToChat = () => {
  return (<div className="relative">
    <div className="[mask-image:radial-gradient(ellipse_1200%_50%_at_50%_50%,black_50%,transparent_100%)] [mask-size:100%_100%] [mask-repeat:no-repeat] flex flex-col gap-4">
      <Bubble />
      <Bubble variant="right" />
      <Bubble />
    </div>
    <Pills size="lg" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="flex items-center gap-[0.5px]">
        <Star size={16} strokeWidth={0} className="fill-white" />
        {Array.from({ length: 4 }).map((_, index) => (
          <Star key={index} size={16} strokeWidth={0} className="fill-white/25" />
        ))}
      </div>
      <Separator orientation="vertical" className="mx-2.5 bg-white/15 w-[1.25px]! h-2! my-auto" />
      <span className="text-xs">1/5 rating</span>
    </Pills>
  </div>
  )

}


const ToastBubble = ({
  wraperClassName,
  className,
  children
}: {
  wraperClassName?: string,
  className?: string,
  children: React.ReactNode
}) => (
  <GlassPanel
    wrapperClassName={cn("w-full origin-center", wraperClassName)}
    className={cn("opacity-5", className)}
  >
    <div className={cn("flex items-center gap-2")}>
      {children}
      <div className="w-full h-6 bg-white rounded-sm" />
    </div>
  </GlassPanel>
)

export const ImpactRatingInsights = () => {
  return (
    <div className="relative">
      <Pills size="lg" className="absolute z-60 top-20 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Image src="/landing/magnifying-glass.png" alt="Magnifying glass" width={158} height={182} className="absolute -right-10 -top-[53px] z-100" />
        <div className="flex items-center gap-[0.5px]">
          <Star size={16} strokeWidth={0} className="fill-white" />
          {Array.from({ length: 4 }).map((_, index) => (
            <Star key={index} size={16} strokeWidth={0} className="fill-white/25" />
          ))}
        </div>
        <Separator orientation="vertical" className="mx-2.5 bg-white/15 w-[1.25px]! h-2! my-auto" />
        <span className="text-xs">1/5 rating</span>
      </Pills>
      {/* Stack: back (smaller) → front (full size), all centered on same axis */}
      <div className="flex flex-col items-center gap-0 mt-36 w-3/4 mx-auto">
        <ToastBubble wraperClassName="z-50 backdrop-blur-xl" className="z-50" >
          <div className="size-6 p-1 rounded-full flex items-center justify-center bg-white text-background">
            !
          </div>
        </ToastBubble>
        <ToastBubble wraperClassName="z-40 scale-90 -mt-3 opacity-70" className="z-40" >
          <div className="size-6 p-1 rounded-full flex items-center justify-center bg-white text-background">
            !
          </div>
        </ToastBubble>
        <ToastBubble wraperClassName="z-30 scale-75 -mt-5 opacity-40" className="z-30" >
          <div className="size-6 p-1 rounded-full flex items-center justify-center bg-white text-background">
            !
          </div>
        </ToastBubble>
      </div>
    </div>
  )
}



export const ImpactAutomatedFix = () => {
  return (
    <div className="relative flex flex-col items-center gap-0 pb-16">
      {/* Top: delivery block (left) + exclamation & avatar (right) */}
      <div className="relative w-full max-w-sm ">
        <div className="relative w-3/4 mx-auto">
          <Pills variant="buttonRounded" innerClassName="p-2" className="z-50 absolute p-1 -right-2 -top-2 shrink-0">
            <span className="text-xs font-bold size-1 flex items-center justify-center">!</span>
          </Pills>
          <ToastBubble className="opacity-10">
            <Truck strokeWidth={2.5} size={32} />
          </ToastBubble>

        </div>

      </div>

      {/* Connector line */}
      <div className="h-4 w-0.5 bg-white/20" />

      {/* Middle: refresh circle */}
      <Pills variant="buttonRounded" className="shrink-0">
        <RefreshCw strokeWidth={3} className="size-7 text-foreground" />
      </Pills>

      {/* Connector line */}
      <div className="h-4 w-0.5 bg-white/20" />

      {/* Bottom: Customer Supported pill */}
      <Pills className="p-1 relative z-10" >
        <MessagesSquare className="size-4 mr-2  text-foreground fill-foreground" />
        <span className="text-sm">Customer Supported</span>
      </Pills>

      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-3/4 [mask-image:radial-gradient(ellipse_90%_50%_at_50%_45%,black_50%,transparent_100%)] [mask-size:100%_100%] [mask-repeat:no-repeat] flex flex-col gap-2">
        <Bubble size="sm" />
        <Bubble variant="right" size="sm" />
      </div>
    </div>
  )
}