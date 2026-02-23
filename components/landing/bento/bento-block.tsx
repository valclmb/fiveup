import { Pills } from "@/components/custom-ui/pills"
import { BinaryPattern } from "@/components/ui/binary-pattern"
import { DotPattern } from "@/components/ui/dot-pattern"
import WhatsappLogo from "@/public/images/whatsapp-logo.svg"
import SafeguardEllipse from "@/public/landing/safeguard-ellipse.svg"
import Shield from "@/public/landing/shield.svg"
import { Star } from "lucide-react"
const TopDotted = () => {
  return (
    <>
      <DotPattern
        glow
        width={10}
        height={10}
        opacity={0.7}
        className="[mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,white,transparent,transparent)]"
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl blur-2xl bg-[radial-gradient(ellipse_70%_100%_at_50%_0%,color-mix(in_oklch,var(--primary)_25%,transparent)_0%,transparent_60%)]"
        aria-hidden
      />
    </>

  )
}

export const TopRightDotted = () => {
  return (
    <>
      <DotPattern
        glow
        width={10}
        height={10}
        opacity={0.7}
        className="[mask-image:radial-gradient(ellipse_140%_100%_at_80%_0%,white,transparent,transparent)]"

      />
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl blur-2xl bg-[radial-gradient(ellipse_140%_100%_at_80%_0%,color-mix(in_oklch,var(--primary)_25%,transparent)_0%,transparent_60%)]"
        aria-hidden
      />
    </>
  )
}

export const BentoSetup = () => {
  return (
    <div >
      <TopDotted />
      <>TEST</>
    </div>
  )
}


export const BentoConnect = () => {
  return (
    <div>
      <TopDotted />
      <>TEST</>
    </div>
  )
}

export const BentoReplies = () => {
  return (
    <div>
      <TopRightDotted />
      <>TEST</>
    </div>
  )
}

export const BentoReputation = () => {
  return (
    <>
      <BinaryPattern
        width={30}
        height={30}
        fontSize={16}
        glow
        className="-top-5 left-2 [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,white,transparent_70%)]"
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl blur-2xl bg-[radial-gradient(ellipse_90%_100%_at_50%_0%,color-mix(in_oklch,var(--primary)_25%,transparent)_0%,transparent_60%)]"
        aria-hidden
      />
      <div className="flex justify-center items-center h-full ">
        <div className="flex items-center -translate-y-6">
          <div
            className="p-1.5 rounded-full bg-background/2 backdrop-blur-xl border-[0.3px] border-white/10 [box-shadow:0_10.602px_3.313px_0_rgba(0,0,0,0),0_7.289px_2.651px_0_rgba(0,0,0,0.01),0_3.976px_2.651px_0_rgba(0,0,0,0.05),0_1.988px_1.988px_0_rgba(0,0,0,0.09),0_0.663px_0.663px_0_rgba(0,0,0,0.1)]"
          >
            <Pills variant="buttonRounded" className="p-1" innerClassName="p-2">
              <WhatsappLogo />
            </Pills>
          </div>
          <SafeguardEllipse />
        </div>
        <div className="relative flex h-[120px] w-[86px] shrink-0 items-center justify-center sm:h-[162px] sm:w-[116px]">
          {/* Concentric layers (shield shape, static) */}
          <Shield
            className="absolute h-full w-auto scale-[1.06] opacity-40"
            aria-hidden
          />
          <Shield
            className="absolute h-full w-auto scale-[1.12] opacity-25"
            aria-hidden
          />
          <Shield
            className="absolute h-full w-auto scale-[1.18] opacity-[0.12]"
            aria-hidden
          />
          <Shield
            className="absolute h-full w-auto scale-[1.24] opacity-[0.05]"
            aria-hidden
          />
          <Shield className="relative z-10 h-full w-auto" />
        </div>
        <div className="flex items-center -translate-y-6">
          <SafeguardEllipse className="scale-x-[-1]" />
          <div
            className="p-1.5 rounded-full bg-background/2 backdrop-blur-xl border-[0.3px] border-white/10 [box-shadow:0_10.602px_3.313px_0_rgba(0,0,0,0),0_7.289px_2.651px_0_rgba(0,0,0,0.01),0_3.976px_2.651px_0_rgba(0,0,0,0.05),0_1.988px_1.988px_0_rgba(0,0,0,0.09),0_0.663px_0.663px_0_rgba(0,0,0,0.1)]"
          >
            <Pills variant="buttonRounded" className="p-1" innerClassName="p-2">
              <Star size={16} className="fill-foreground" />
            </Pills>
          </div>
        </div>
      </div>
    </>
  )
}

export const BentoFlow = () => {
  return (
    <div>
      <TopDotted />
      <>TEST</>
    </div>
  )
}