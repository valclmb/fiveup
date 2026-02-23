import { Benefits } from "@/components/landing/benefits";
import { Features } from "@/components/landing/bento/bento";
import { Cta } from "@/components/landing/cta";
import { Faq } from "@/components/landing/faq";
import { Hero } from "@/components/landing/hero/hero";
import { Impact } from "@/components/landing/impact/impact";
import { Pricing } from "@/components/landing/pricing";
import { Results } from "@/components/landing/results";
import { Reviews } from "@/components/landing/reviews";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Benefits />
      <Features />
      <Impact />
      <Results />
      <Reviews />
      <Pricing />
      <Faq />
      <Cta />

      {/* <Hero />

     
      <VideoPreview />

      <Benefits />
      <Features />

      <Impact />
      <Results />
      <LandingBlock title="Simple and transparent pricing" badge="Pricing">
        <div>Construction en cours...</div>
      </LandingBlock>
      <Reviews />
      <Faq />
      <Cta /> */}
    </>
  );
}
