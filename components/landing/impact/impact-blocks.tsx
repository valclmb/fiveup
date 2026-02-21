import { Pills } from "@/components/custom-ui/pills"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Star } from "lucide-react"

const Bubble = ({ variant = "left" }: { variant?: "left" | "right" }) => {
  return (
    <div
      className={cn(
        "relative p-[1px] rounded-lg w-7/12 backdrop-blur-xl opacity-5",
        "before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:rounded-t-lg",
        "before:bg-gradient-to-b before:w-10/12 before:mx-auto before:from-transparent before:via-white before:to-transparent before:pointer-events-none",
        variant === "left" ? "rounded-bl-none" : "rounded-br-none self-end",
        "bg-gradient-to-b from-white/60 to-white/20"
      )}
    >
      <div className="p-3 space-y-4 h-full">
        <div className="w-1/2 h-4 bg-white rounded-xl" />
        <div className="w-full h-2.5 bg-white rounded-xl" />
      </div>
    </div>
  )
}

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

export const ImpactRatingInsights = () => {
  return (
    <>TEST</>
  )
}

export const ImpactAutomatedFix = () => {
  return (
    <>TEST</>
  )
}