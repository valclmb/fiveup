import Benefits from "./components/benefits";
import Cta from "./components/cta";
import Faq from "./components/faq";
import { Features } from "./components/features/features";
import Hero from "./components/hero/hero";
import Impact from "./components/impact";
import { LandingBlock } from "./components/landing-block";
import Results from "./components/results";
import Reviews from "./components/reviews";
import { VideoPreview } from "./components/video-preview";

export default function LandingPage() {
  return (
    <>

      <Hero />

      {/* Presentation video */}
      <VideoPreview />

      <Benefits />
      <Features />
      {/* <DashboardPreview /> */}
      <Impact />
      <Results />
      <LandingBlock title="Simple and transparent pricing" badge="Pricing">
        <div>Construction en cours...</div>
      </LandingBlock>
      <Reviews />
      <Faq />
      <Cta />
    </>
  );
}
