import { cn } from "@/lib/utils"
import { Check, Star } from "lucide-react"


type HeroDiagramCardProps = {
  type: "check-stars" | "alert-stars"
}
const PLACEHOLDER_CARDS: HeroDiagramCardProps[] = [
  { type: "alert-stars" },
  { type: "alert-stars" },
  { type: "alert-stars" },
  { type: "check-stars" },
  { type: "check-stars" },
  { type: "check-stars" },
]

const ROW_HEIGHT = 56
const CARD_GAP = 16

export const HeroDiagramGrid = () => {


  return (
    <div
      className={cn(
        "mask-fade-hero-grid grid grid-cols-3 gap-4 min-w-[782px] min-h-[424px] rounded-2xl"
      )}
    >
      {/* Left column: staggered offset, static */}
      <div className="flex flex-col gap-4 content-start">
        {PLACEHOLDER_CARDS.map((card, i) => (
          <div key={i} className="translate-y-6">
            <HeroDiagramCard type={card.type} />
          </div>
        ))}
      </div>

      {/* Middle column: overflow clip + inner wrapper ready for infinite scroll animation */}
      <div className="overflow-hidden min-h-[424px]">
        <div
          className="flex flex-col gap-4"
          style={{ minHeight: PLACEHOLDER_CARDS.length * (ROW_HEIGHT + CARD_GAP) - CARD_GAP }}
        >
          {PLACEHOLDER_CARDS.map((card, i) => (
            <HeroDiagramCard key={i} type={card.type} />
          ))}
        </div>
      </div>

      {/* Right column: staggered offset, static */}
      <div className="flex flex-col gap-4 content-start">
        {PLACEHOLDER_CARDS.map((card, i) => (
          <div key={i} className="translate-y-6">
            <HeroDiagramCard type={card.type} />
          </div>
        ))}
      </div>
    </div>
  )
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
      <div className="h-2.5 w-14 bg-white/10 rounded-[4px]" />
    </div>
  </div>
)
