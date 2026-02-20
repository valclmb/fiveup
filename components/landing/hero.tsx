import { cn } from "@/lib/utils";
import { ChevronRight, Star } from "lucide-react";
import Image from "next/image";
import { AnimatedGridPattern } from "../ui/animated-grid-pattern";
import { Button } from "../ui/button";
import Typography from "../ui/typography";


export const Hero = () => {
  return (
    <section className="relative overflow-hidden rounded-4xl mt-20 ">
      <AnimatedGridPattern
        color="var(--primary)"
        fillOpacity={0.2}
        className={cn(
          "[mask-image:radial-gradient(ellipse_100%_40%_at_50%_40%,white,transparent)]",
        )}
        width={60}
        height={60}
      />
      <div className="absolute -bottom-64 bg-primary w-full h-[650px] rounded-full blur-[100px]" />
      <div className="max-w-[636px] mx-auto flex flex-col items-center gap-9">
        <RatingBadge />
        <Typography variant="h1" className="text-center">
          Turn every customer into a 5 star review
        </Typography>
        <Typography variant="p" affects="muted" className="text-center px-12">
          FiveUp sends review requests, collects feedback, and guides customers to review you on Google and Trustpilot or contact support on WhatsApp.
        </Typography>
        {/* CTA buttons */}
        <div className="flex items-center gap-3">
          <Button variant="landing">
            Get more reviews <ChevronRight size={14} />
          </Button>
          <Button variant="secondary">
            Discover features
          </Button>
        </div>
        <div className="flex items-center gap-6">
          <Typography variant="p" affects="mutedDescription">
            Reviews published on
          </Typography>
          <Image src="/landing/trustpilot-white.svg" alt="Trustpilot" width={114} height={100} className="filter grayscale brightness-200 contrast-100" />
          <Image src="/landing/google-white.svg" alt="Google" width={71} height={28} className="translate-y-1 filter grayscale brightness-200 contrast-100" />
        </div>

        <div className={cn("relative bg-linear-to-b from-white/5 to-background/10 border border-foreground/10 border-b-0 mt-12 w-[861px] h-[482px] p-3 pb-0 rounded-t-[40px] backdrop-blur-[50px]",
          "after:absolute after:content-[''] after:h-10 after:w-54 after:bg-primary after:top-0 after:left-1/2 after:-translate-x-1/2 after:blur-3xl after:rounded-full",
          "before:content-[''] before:absolute before:inset-0 before:w-1/2 before:translate-x-1/2 before:h-[1.5px] before:bg-[linear-gradient(to_right,transparent,white,transparent)]"
        )}>
          {/* Orbs */}
          <div className="absolute -top-9 left-1/2 -translate-x-1/2 w-42  h-12">
            <div className="absolute bottom-1.5 size-[3px] bg-white rounded-full blur-[0.5px]" />
            <div className="absolute left-6 top-0 size-[3px] bg-white rounded-full blur-[0.5px]" />
            <div className="absolute left-12 top-4 size-[2px] bg-white rounded-full blur-[0.5px]" />
            <div className="absolute left-1/2 bottom-5 size-[3px] bg-white rounded-full blur-[0.5px]" />
            <div className="absolute right-14 top-0 size-[3px] bg-white rounded-full blur-[0.5px]" />
            <div className="absolute right-12 bottom-4 size-[3px] bg-white rounded-full blur-[0.5px]" />
            <div className="absolute right-2 size-[2px] bg-white rounded-full blur-[0.5px]" />
            <div className="absolute right-0 bottom-6 size-[3px] bg-white rounded-full blur-[0.5px]" />

          </div>
          {/* Left and right borders */}
          <div
            className="pointer-events-none absolute inset-y-0 -right-[1px] w-[1px] h-3/4 top-1/2 -translate-y-1/2 bg-[linear-gradient(to_bottom,transparent,#ffffff80,transparent)]"
          />
          <div
            className="pointer-events-none absolute inset-y-0 -left-[1px] w-[1px] h-3/4 top-1/2 -translate-y-1/2 bg-[linear-gradient(to_bottom,transparent,#ffffff80,transparent)]"
          />
          {/* Left and right borders */}
          <div className="bg-background w-full h-full rounded-t-[30px] p-10">
            test
          </div>
        </div>

      </div>
    </section >
  );
};

const RatingBadge = () => (
  <div className="flex items-center gap-2 bg-secondary text-sm max-w-max px-1.5 py-1 backdrop-blur-[50px] rounded-full ">
    <div className="flex items-center gap-0.5 bg-primary px-2 py-0.5 rounded-full border border-primary shadow-[inset_0_2.37px_3.56px_1.19px_#A2FFDD,inset_0_-1.19px_3.56px_1.19px_#7CFFCF]">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} size={11} className="text-background fill-background" />
      ))}
    </div>
    Rated 4.9/5 from over 600 reviews
    <ChevronRight size={14} />
  </div>
);