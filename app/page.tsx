import Benefits from "@/app/components/benefits";
import Image from "next/image";
import Cta from "./components/cta";
import DashboardPreview from "./components/dashboard-preview";
import Faq from "./components/faq";
import { Features } from "./components/features/features";
import Header from "./components/header";
import Hero from "./components/hero/hero";
import Impact from "./components/impact";
import { LandingBlock } from "./components/landing-block";
import Results from "./components/results";
import Reviews from "./components/reviews";

export default function Page() {
  return (
    <div className=" flex min-h-screen items-center justify-center bg-background font-sans ">

      <main className="flex min-h-screen w-full max-w-7xl flex-col items-center space-y-36 p-8 sm:items-start">
        <Header />
        <Hero />

        {/* Presentation video */}
        <div className="w-2/3 mx-auto space-y-16">
          <Image src="/images/preview-video.jpg" alt='preview-video' width={1000} height={1000} className="mx-auto rounded-[48px]" />
          <div className="flex justify-between">
            <Image src="/images/partner-logo.svg" alt="partner-logo" width={150} height={40} />
            <Image src="/images/partner-logo.svg" alt="partner-logo" width={150} height={40} />
            <Image src="/images/partner-logo.svg" alt="partner-logo" width={150} height={40} />
            <Image src="/images/partner-logo.svg" alt="partner-logo" width={150} height={40} />
          </div>
        </div>

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
    </div>
  );
}