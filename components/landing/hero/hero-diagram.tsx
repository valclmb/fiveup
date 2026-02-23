import { Pills } from "@/components/custom-ui/pills"
import { cn } from "@/lib/utils"
import GoogleLogo from "@/public/images/google-logo.svg"
import ShopifyLogo from "@/public/images/shopify-logo.svg"
import TrustpilotLogo from "@/public/images/trustpilot-logo.svg"
import ProgressCircle from "@/public/landing/progress-circle.svg"
import { MessagesSquare, Star } from "lucide-react"
import Image from "next/image"
import { HeroDiagramGrid } from "./hero-diagram-grid"



export const HeroDiagram = () => {
  return (
    <div className={cn("relative bg-linear-to-b from-white/5 to-background/10 border border-foreground/10 border-b-0 mt-12 w-[861px] h-[482px] p-3 pb-0 rounded-t-[40px] backdrop-blur-[50px]",
      "after:absolute after:content-[''] after:h-10 after:w-54 after:bg-primary after:top-0 after:left-1/2 after:-translate-x-1/2 after:blur-3xl after:rounded-full",
      "before:content-[''] before:absolute before:inset-0 before:w-1/2 before:translate-x-1/2 before:h-[1.5px] before:bg-[linear-gradient(to_right,transparent,white,transparent)]"
    )}>
      <div className="absolute -top-9 left-1/2 -translate-x-1/2 w-42 h-12">
        <div className="absolute bottom-1.5 size-[3px] bg-white rounded-full blur-[0.5px]" />
        <div className="absolute left-6 top-0 size-[3px] bg-white rounded-full blur-[0.5px]" />
        <div className="absolute left-12 top-4 size-[2px] bg-white rounded-full blur-[0.5px]" />
        <div className="absolute left-1/2 bottom-5 size-[3px] bg-white rounded-full blur-[0.5px]" />
        <div className="absolute right-14 top-0 size-[3px] bg-white rounded-full blur-[0.5px]" />
        <div className="absolute right-12 bottom-4 size-[3px] bg-white rounded-full blur-[0.5px]" />
        <div className="absolute right-2 size-[2px] bg-white rounded-full blur-[0.5px]" />
        <div className="absolute right-0 bottom-6 size-[3px] bg-white rounded-full blur-[0.5px]" />
      </div>
      <div className="pointer-events-none absolute inset-y-0 -right-[1px] w-[1px] h-3/4 top-1/2 -translate-y-1/2 bg-[linear-gradient(to_bottom,transparent,#ffffff80,transparent)]" />
      <div className="pointer-events-none absolute inset-y-0 -left-[1px] w-[1px] h-3/4 top-1/2 -translate-y-1/2 bg-[linear-gradient(to_bottom,transparent,#ffffff80,transparent)]" />
      <div className="relative bg-background w-full h-full rounded-t-[30px] px-6 overflow-hidden flex items-center justify-between">
        <p className="text-[8px] -rotate-90 text-white/50  tracking-[2.7px]">CONNECTED</p>
        <div className="flex flex-col items-center gap-10">
          <Pills>
            <GoogleLogo width={55} />
          </Pills>
          <Pills>
            <TrustpilotLogo width={70} />
          </Pills>
          <Pills>
            <ShopifyLogo width={60} />
          </Pills>
        </div>
        <div className="relative mx-auto h-full overflow-hidden flex items-center justify-center">
          <>
            {/* Grid centered without absolute; cards keep their space (min 250px), edges clipped */}
            <HeroDiagramGrid />
            <div className="w-96 mx-auto absolute inset-0 pointer-events-none flex items-center justify-center z-10">
              <div
                className={cn(
                  "absolute left-0 right-0 top-1/2 -translate-y-1/2 h-2 bg-white rounded-full mix-blend-plus-lighter shadow-white",
                  "[box-shadow:0_0_0_1px_rgba(255,255,255,0.4),0_0_14px_2px_rgba(255,255,255,0.2),0_8px_24px_-2px_rgba(0,0,0,0.35)]"
                )}
              />
              <Pills className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 shadow-sm shadow-black/70 pointer-events-auto">
                <Image src="logos/logo-white.svg" alt="logo" width={62} height={20} />
              </Pills>
            </div>
          </>
        </div>
        <div className="flex flex-col items-center gap-10 text-[9px]">
          <Pills innerClassName="flex items-center gap-1">
            <ProgressCircle size={10} className="text-foreground" />
            Request Sent
          </Pills>
          <Pills innerClassName="flex items-center gap-1">
            <Star size={10} className="fill-foreground" />
            Customer Rates
          </Pills>
          <Pills innerClassName="flex items-center gap-1">
            <MessagesSquare size={10} className="fill-foreground" />
            Reviews & Support
          </Pills>
        </div>
        <p className="text-[8px] rotate-90 text-white/50 tracking-[2.7px]">STATUS</p>
      </div>
    </div>
  )
}