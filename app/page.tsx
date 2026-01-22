import Benefits from "@/app/components/benefits";
import Cta from "./components/cta";
import DashboardPreview from "./components/dashboard-preview";
import Faq from "./components/faq";
import { Features } from "./components/features/features";
import Footer from "./components/footer";
import Header from "./components/header";
import Hero from "./components/hero/hero";
import Impact from "./components/impact";
import { LandingBlock } from "./components/landing-block";
import Results from "./components/results";
import Reviews from "./components/reviews";
import { VideoPreview } from "./components/video-preview";

export default function Page() {
  return (
    <div className=" flex flex-col min-h-screen items-center justify-center bg-background font-sans ">
      <main className="flex min-h-screen w-full max-w-7xl flex-col items-center space-y-8 md:space-y-36 p-4  md:p-4  sm:items-start">
        <Header />
        <Hero />

        {/* Presentation video */}
        <VideoPreview />

        <Benefits />
        <Features />
        <DashboardPreview />
        <Impact />
        <Results />
        <LandingBlock title="Tarifs simples et transparents" badge="Tarifs">
          <div>Construction en cours...</div>

        </LandingBlock>
        <Reviews />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}