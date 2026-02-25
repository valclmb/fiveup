import { Pills, PillsBlured } from "@/components/custom-ui/pills"
import { BinaryPattern } from "@/components/ui/binary-pattern"
import { Button } from "@/components/ui/button"
import { DotPattern } from "@/components/ui/dot-pattern"
import { Separator } from "@/components/ui/separator"
import Typography from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import GoogleLogo from "@/public/images/google-logo.svg"
import ShopifyLogo from "@/public/images/shopify-logo.svg"
import TrustpilotLogo from "@/public/images/trustpilot-logo.svg"
import WhatsappLogo from "@/public/images/whatsapp-logo.svg"
import ShoppingBag from "@/public/landing/benefits-shop.svg"
import StarIcon from "@/public/landing/benefits-stars.svg"
import MouseGrab from "@/public/landing/mouse-grab.svg"
import ProgressCircle from "@/public/landing/progress-circle.svg"
import SafeguardEllipse from "@/public/landing/safeguard-ellipse.svg"
import Shield from "@/public/landing/shield.svg"
import { ArrowRight, Plus, Star } from "lucide-react"
import Image from "next/image"

const TopDotted = () => {
  return (
    <>
      <div className="absolute inset-2 w-full h-50 [mask-image:radial-gradient(ellipse_100%_200%_at_50%_0%,white,transparent,transparent)]">
        <DotPattern
          glow
          width={10}
          height={10}
          opacity={0.7}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 rounded-2xl blur-2xl 
        bg-[radial-gradient(ellipse_70%_100%_at_50%_0%,color-mix(in_oklch,var(--primary)_25%,transparent)_0%,transparent_60%)]"
        aria-hidden
      />
    </>

  )
}

export const TopRightDotted = () => {
  return (
    <>
      <div className="absolute inset-2 w-full h-26 [mask-image:radial-gradient(ellipse_150%_180%_at_80%_0%,white,transparent,transparent)]">
        <DotPattern
          glow
          width={10}
          height={10}
          opacity={0.7}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 rounded-2xl blur-2xl bg-[radial-gradient(ellipse_100%_80%_at_80%_0%,color-mix(in_oklch,var(--primary)_25%,transparent)_0%,transparent_60%)]"
        aria-hidden
      />
    </>
  )
}

const BentoSetupCard = ({ children, className, orientation = "left" }: { children?: React.ReactNode, className?: string, orientation?: "left" | "right" }) => {
  return (
    <div className={cn(" p-px  border-t-[0.5px] border-primary/30 rounded-2xl overflow-hidden",
      orientation === "left" ? "-rotate-[8deg] border-l-[0.5px]" : "rotate-[8deg] border-r-[0.5px]",
      "bg-primary/5 rounded-2xl backdrop-blur-2xl size-30 flex items-center justify-center",
      "[box-shadow:inset_0_2px_8px_rgba(255,255,255,0.08)] [filter:drop-shadow(0_4px_12px_rgba(0,0,0,0.15))]",
      className
    )}>
      {children}
    </div>

  )
}



export const BentoSetup = () => {
  return (
    <>
      <TopDotted />
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 gap-6">
        {/* Logo: five + up */}
        <Image src="/logos/logo-white.svg" alt="five up" width={92} height={30} />

        {/* Flow: Store card → Arrow → Star card */}
        <div className="flex items-center justify-center gap-4">
          {/* Left card (Store / Shopping bag) */}
          <div className="relative">
            <BentoSetupCard className="absolute translate-y-8 -translate-x-8 opacity-15" />
            <BentoSetupCard className="absolute translate-y-4 -translate-x-4 opacity-25" />
            <BentoSetupCard>
              <ShoppingBag width={42} className="fill-primary -rotate-[2deg]" />
            </BentoSetupCard>

          </div>
          <div className="relative min-w-22">
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 h-[2px] bg-white/10 w-[1%] " />
            <Pills variant="buttonRounded" className="relative p-1 w-fit mx-auto" innerClassName="p-2" >
              <ArrowRight strokeWidth={2.5} size={16} className=" text-primary" />
            </Pills>
          </div>
          <div className="relative">
            <BentoSetupCard className="absolute translate-y-8 translate-x-8 opacity-15" orientation="right" />
            <BentoSetupCard className="absolute translate-y-4 translate-x-4 opacity-25" orientation="right" />
            <BentoSetupCard orientation="right">
              <StarIcon width={57} className="fill-primary -rotate-[2deg]" />
            </BentoSetupCard>

          </div>
        </div>
      </div >

    </>
  )
}


export const BentoConnect = () => {
  return (
    <>
      <TopDotted />
      <div className="relative h-full w-11/12 mx-auto z-10 flex flex-col items-center gap-5 px-3">
        <div className="absolute border-[3px] border-b-0 rounded-lg [inset:30.5px_63px] h-5/12" />
        {/* Top: Trustpilot */}
        <PillsBlured className={cn("absolute z-20 top-0 left-1/2 -translate-x-1/2",
          "after:z-20 after:content-[''] after:w-5 after:h-[2.5px] after:absolute after:top-1/2 after:-right-[21px] after:-translate-y-1/2 after:bg-linear-to-l after:from-transparent after:to-white  ",
          "before:z-20 before:content-[''] before:w-5 before:h-[2.5px] before:absolute before:top-1/2 before:-left-[21px] before:-translate-y-1/2 before:bg-linear-to-r before:from-transparent before:to-white  "
        )} >

          <Pills className="z-20">
            <TrustpilotLogo width={93} />
          </Pills>
        </PillsBlured>
        <PillsBlured className={cn("absolute left-0 top-2/3 -translate-y-2/3",
          "after:z-20 after:content-[''] after:w-[2.5px] after:h-5 after:absolute after:left-1/2 after:-translate-x-1/2 after:-top-[21px] after:bg-linear-to-b after:from-transparent after:to-white",
          "before:z-20 before:content-[''] before:h-[2.5px] before:w-20 before:absolute before:top-1/2 before:-translate-x-1/2 before:-right-28 before:bg-white/10",
        )} >
          <Pills  >
            <ShopifyLogo width={80} />
          </Pills>
        </PillsBlured>
        {/* Google */}
        <PillsBlured className={cn("absolute right-0 top-2/3 -translate-y-2/3",
          "after:z-20 after:content-[''] after:w-[2.5px] after:h-5 after:absolute after:-ml-1 after:left-1/2 after:-translate-x-1/2 after:-top-[21px] after:bg-linear-to-b after:from-transparent after:to-white",
        )} >
          <Pills  >
            <GoogleLogo className="w-18" />
          </Pills>
        </PillsBlured>
        {/* Processing pill with concentric glow */}
        <div className="absolute -mt-1 top-2/3 left-1/2 -translate-x-1/2 -translate-y-2/3 flex items-center justify-center">
          <div className="pointer-events-none absolute -inset-3.5 rounded-full bg-linear-to-r from-primary/10 via-primary/30 to-primary/10" />
          <div className="pointer-events-none opacity-30 absolute -inset-7 rounded-full bg-linear-to-r from-primary/10 via-primary/30 to-primary/10" />
          <div className="pointer-events-none opacity-10 absolute -inset-10.5 rounded-full bg-linear-to-r from-primary/10 via-primary/30 to-primary/10" />
          <div className="pointer-events-none opacity-5 absolute -inset-14 rounded-full bg-linear-to-r from-primary/10 via-primary/30 to-primary/10" />
          <div className="pointer-events-none opacity-5 absolute -inset-17.5 rounded-full border border-foreground/20" />
          <div className="pointer-events-none opacity-5 absolute -inset-22 rounded-full border border-foreground/20" />
          <div className="pointer-events-none opacity-5 absolute -inset-25.5 rounded-full border border-foreground/20" />
          <Button
            variant="landing"
            className="hover:scale-100 rounded-full border-primary flex items-center [box-shadow:0_42px_12px_0_rgba(19,24,34,0.01),0_27px_11px_0_rgba(19,24,34,0.04),0_15px_9px_0_rgba(19,24,34,0.15),0_7px_7px_0_rgba(19,24,34,0.26),0_2px_4px_0_rgba(19,24,34,0.29)]"
          >
            <ProgressCircle className="mt-1" />
            Processing
          </Button>
        </div>
      </div>
    </>
  )
}

export const BentoReplies = () => {
  return (
    <>
      <TopRightDotted />
      <div className="relative z-10 flex flex-col gap-3 p-4 rounded-xl border-t-2  border-white/10 border-r-0 border-b-0 bg-linear-to-b from-white/3 to-bg-transparent backdrop-blur-sm">
        {/* Review card */}
        <div className="rounded-xl border-[0.4px] border-white/3 w-7/12  px-4 py-3 shadow-lg  rounded-bl-none bg-background ">
          <Typography variant="p" className="text-xs">Amazing Service</Typography>
          <div className="mt-1.5 flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={11} className="fill-foreground" />
              ))}
            </div>
            <Separator orientation="vertical" />
            <Typography variant="p" affects="mutedDescription" className="text-xs">5/5 rating</Typography>
          </div>
        </div>
        <div className="space-y-2 rounded-xl self-end border w-7/12  p-3 shadow-lg bg-primary rounded-br-none">
          <Typography variant="p" className="text-black text-xs">We're pleased to hear that</Typography>
          <Button variant="secondary" size="sm" className="text-xs bg-black rounded-[6px] w-full">Auto Reply</Button>

        </div>
      </div>
    </>
  )
}

export const BentoReputation = () => {
  return (
    <>
      <div className="absolute inset-0 -top-5 w-full h-52 [mask-image:radial-gradient(ellipse_100%_250%_at_50%_0%,white,transparent,transparent)]">
        <BinaryPattern
          width={30}
          height={30}
          fontSize={16}
          glow
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl blur-2xl bg-[radial-gradient(ellipse_90%_100%_at_50%_0%,color-mix(in_oklch,var(--primary)_25%,transparent)_0%,transparent_60%)]"
        aria-hidden
      />
      <div className="flex justify-center items-center h-full ">
        <div className="z-20 flex items-center -translate-y-6 translate-x-1">
          <PillsBlured>
            <Pills variant="buttonRounded" className="p-1" innerClassName="p-2">
              <WhatsappLogo />
            </Pills>
          </PillsBlured>
          <SafeguardEllipse />
        </div>
        <div className="z-10 relative flex h-[120px] w-[86px] shrink-0 items-center justify-center sm:h-[162px] sm:w-[116px]">
          {/* Single backdrop-blur layer (largest) so blur doesn't stack; others are tint-only */}
          <div
            className="shield-blur-layer origin-[50%_40%] absolute inset-0  scale-200 backdrop-blur-xs bg-primary/1"
            aria-hidden
          />
          <div
            className="shield-blur-layer origin-[50%_40%] absolute inset-0 scale-180 bg-primary/3"
            aria-hidden
          />
          <div
            className="shield-blur-layer origin-[50%_40%] absolute inset-0  scale-160 bg-primary/5"
            aria-hidden
          />
          <div
            className="shield-blur-layer origin-[50%_40%] absolute inset-0 scale-130 bg-primary/10"
            aria-hidden
          />
          <Shield className="relative z-10 h-full w-auto" />
        </div>
        <div className="z-20 flex items-center -translate-y-6 -translate-x-1 ">
          <SafeguardEllipse className="scale-x-[-1]" />
          <PillsBlured>
            <Pills variant="buttonRounded" className="p-1" innerClassName="p-2">
              <Star size={16} className="fill-foreground" />
            </Pills>
          </PillsBlured>
        </div>
      </div>
    </>
  )
}

const flowCards = [
  {
    title: "WhatsApp Review Boost",
    subtitle: "Post-purchase review request",
    active: false,
  },
  {
    title: "Delay Saver Flow",
    subtitle: "Auto reassurance when delivery is late",
    active: true,
  },
  {
    title: "5★ Public Push",
    subtitle: "happy customers → Google/Trustpilot",
    active: false,
  },
]

export const BentoFlow = () => {
  return (
    <>
      <TopDotted />
      <div className="relative z-10 flex flex-col gap-3 p-4">
        {flowCards.map((card, i) => (
          <div key={card.title} className="relative">
            {card.active && (<>
              <MouseGrab className="z-20 absolute -right-8 -bottom-1" />
              <div className="absolute inset-0  h-full w-full rounded-lg border border-dashed" />

            </>
            )}
            <div
              key={card.title}
              className={cn(
                "relative overflow-hidden flex items-center justify-between gap-4 rounded-lg border-t border-white/10  bg-linear-to-b from-white/5 to-white/4 px-3 py-2.5 backdrop-blur-lg",
                card.active && "translate-x-6"
              )}

            >
              {card.active && (<>
                <div
                  className="absolute inset-0 rounded-[inherit] bg-gradient-to-r from-transparent from-60% to-primary/30  "
                  aria-hidden
                />
                <div className="absolute right-0 my-auto h-3/4 bg-primary blur-sm p-1.5" />
              </>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-foreground">
                  {card.title}
                </p>
                <Typography variant="p" affects="mutedDescription" className="text-xs">
                  {card.subtitle}
                </Typography>
              </div>
              <Plus size={14} strokeWidth={2.5} className={cn("shrink-0 p-[1px] rounded-full", card.active ? "bg-primary text-background " : "bg-white/10  text-background/50")} />
            </div>
          </div>
        ))}
      </div>

    </>
  )
}