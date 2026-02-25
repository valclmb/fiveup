import { cn } from "@/lib/utils";
import { ChevronRight, Star } from "lucide-react";
import Image from "next/image";
import { AnimatedGridPattern } from "../../ui/animated-grid-pattern";
import { Button } from "../../ui/button";
import Typography from "../../ui/typography";
import { HeroDiagram } from "./hero-diagram";

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
          <Button variant="landing" size="lg">
            Get more reviews <ChevronRight data-icon="inline-end" size={14} />
          </Button>
          <Button variant="secondary" size="lg">
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


        <HeroDiagram />
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