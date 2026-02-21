import { Pills } from "@/components/custom-ui/pills"
import { GlassPanel } from "@/components/landing/glass-panel"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import MagnifyingGlass from "@/public/landing/magnifying-glass.svg"
import { Star } from "lucide-react"
const Bubble = ({ variant = "left" }: { variant?: "left" | "right" }) => (
  <GlassPanel
    variant={variant === "left" ? "bubble-left" : "bubble-right"}
    wrapperClassName="w-7/12"
    className="opacity-[0.05]"
  >
    <div className="w-1/2 h-4 bg-white rounded-xl" />
    <div className="w-full h-2.5 bg-white rounded-xl" />
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


const AlertBubble = ({
  className,
}: {
  className?: string
}) => (
  <GlassPanel
    wrapperClassName={cn("w-full origin-center", className)}
    className="opacity-5"
  >
    <div className="flex items-center gap-1">
      <div className="size-6 p-1 rounded-full flex items-center justify-center bg-white text-background">
        !
      </div>
      <div className="w-full h-6 bg-white rounded-sm" />
    </div>
  </GlassPanel>
)

export const ImpactRatingInsights = () => {
  return (
    <div className="relative">
      <Pills size="lg" className="absolute top-20 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <MagnifyingGlass className="absolute z-100" />
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
        <AlertBubble className="z-50 backdrop-blur-xl" />
        <AlertBubble className="z-40 scale-90 -mt-5.5 opacity-70" />
        <AlertBubble className="z-30 scale-75 -mt-7 opacity-40" />
      </div>
    </div>
  )
}

export const ImpactAutomatedFix = () => {
  return (
    <>TEST</>
  )
}