import { cn } from "@/lib/utils"
import { Check, Star } from "lucide-react"


const PLACEHOLDER_CARDS: HeroDiagramCardProps[] = [
  { type: "alert-stars" },
  { type: "alert-stars" },
  { type: "alert-stars" },
  { type: "alert-stars" },
  { type: "alert-stars" },
  { type: "alert-stars" },
  { type: "alert-stars" },
  { type: "alert-stars" },
  { type: "check-stars" },
  { type: "check-stars" },
  { type: "check-stars" },
  { type: "check-stars" },
  { type: "check-stars" },
  { type: "check-stars" },
  { type: "check-stars" },
  { type: "check-stars" },
  { type: "check-stars" },
  { type: "check-stars" },
]

export const HeroDiagramGrid = () => {
  return (
    <div
      className={cn(
        "mask-fade-hero-grid grid grid-cols-3 gap-4 grid-auto-rows-[56px] content-start min-w-[782px] min-h-[424px] rounded-2xl",
        "[&>*:nth-child(3n+1)]:translate-y-6 [&>*:nth-child(3n+3)]:translate-y-6"
      )}
    >
      {PLACEHOLDER_CARDS.map((card, i) => (
        <HeroDiagramCard key={i} type={card.type} />
      ))}
    </div>
  )
}
type HeroDiagramCardProps = {
  type: "check-stars" | "alert-stars"

}
const HeroDiagramCard = ({ type }: HeroDiagramCardProps) => (
  <div
    className={cn(
      "min-w-[250px] rounded-lg border bg-white/5 p-3 flex flex-col gap-2"
    )}
  >
    <div className="flex items-center gap-2">
      {type === "check-stars" ?
        <Check strokeWidth={4} size={18} className=" shrink-0 text-background bg-primary p-1 rounded-full" />
        :
        <div className="size-5 font-bold p-1 rounded-full flex items-center justify-center bg-white/10 text-sm text-background/50">
          !
        </div>}
      <div className="h-5.5 w-full bg-white/10 rounded-[4px]" />
    </div>
    <div className="flex items-center gap-2">

      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} size={11} className={cn("text-white/20 ring-white/2O fill-white/20", (index > 0 && type === "alert-stars") && "opacity-30")} />
        ))}
      </div>
      <div className="h-3 w-12 bg-white/10 rounded-[4px]" />
    </div>
  </div>
)
