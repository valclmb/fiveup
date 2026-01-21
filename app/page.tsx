import Benefits from "@/app/components/benefits";
import Image from "next/image";
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

export default function Page() {
  return (
    <div className=" flex flex-col min-h-screen items-center justify-center bg-background font-sans ">
      <main className="flex min-h-screen w-full max-w-7xl flex-col items-center space-y-8 md:space-y-36 p-4  md:p-4  sm:items-start">
        <Header />
        <Hero />

        {/* Presentation video */}
        <div className="relative md:w-2/3 mx-auto space-y-8 md:space-y-16 mt-10 md:mt-0">
          {/* <Image src="/postcss.config.mp4" alt='preview-video' width={1000} height={1000} className="z-50 mx-auto rounded-[48px]" /> */}
          <video src="/postcss.config.mp4" autoPlay muted loop className="z-50 mx-auto rounded-t-[48px] shadow-[40px_40px_120px_0px] shadow-tertiary"></video>

          <div className="absolute bg-primary  bottom-36 left-1/2 -translate-x-1/2 rounded-full"></div>
          <div className="flex flew-wrap justify-between">
            <Image src="/images/partner-logo.svg" alt="partner-logo" width={150} height={40} className="size-18 md:size-auto" />
            <Image src="/images/partner-logo.svg" alt="partner-logo" width={150} height={40} className="size-18 md:size-auto" />
            <Image src="/images/partner-logo.svg" alt="partner-logo" width={150} height={40} className="size-18 md:size-auto" />
            <Image src="/images/partner-logo.svg" alt="partner-logo" width={150} height={40} className="size-18 md:size-auto" />
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
      <Footer />
    </div>
  );
}