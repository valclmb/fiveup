import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"
import Image from "next/image"
import { AnimatedGridPattern } from "../ui/animated-grid-pattern"
import { Button } from "../ui/button"
import Typography from "../ui/typography"

export const Cta = () => {
  return (
    <section className="relative overflow-hidden rounded-4xl pt-20 ">
      <AnimatedGridPattern
        color="var(--primary)"
        fillOpacity={0.2}
        className={cn(
          "[mask-image:radial-gradient(ellipse_100%_20%_at_50%_20%,white,transparent)]",
        )}
        width={60}
        height={60}
      />
      <div className="absolute -bottom-64 bg-primary w-full h-[320px] rounded-full blur-[100px]" />
      <div className="max-w-[636px] mx-auto flex flex-col items-center gap-6 px-5 lg:px-0 ">

        <Typography variant="h2" className="text-center mb-0">
          Turn your reviews into a competitive advantage
        </Typography>
        <Typography variant="p" affects="mutedDescription" className="text-center px-4 lg:px-32">
          Connect FiveUp and turn every customer into social proof automatically, with no extra work for your team.
        </Typography>

        <Button variant="landing" className="w-full md:w-fit">
          Try FiveUp now <ChevronRight size={14} />
        </Button>



      </div>
      <Image src="/landing/fiveup-liquid.svg" alt="fiveup liquid" className="mx-auto mt-10" width={950} height={300} />

    </section>
  )
}