import Benefits from "@/app/components/benefits";
import Image from "next/image";
import Header from "./components/header";
import Hero from "./components/hero/hero";
import { Reviews } from "./components/reviews/reviews";

export default function Page() {
return (
  <div className=" flex min-h-screen items-center justify-center bg-background font-sans ">
  
  <main className="flex min-h-screen w-full max-w-7xl flex-col items-center space-y-36 p-8 sm:items-start">
    <Header />
    <Hero />

    {/* Presentation video */}
    <div className="w-2/3 mx-auto space-y-16">
    <Image src="/images/preview-video.jpg" alt='preview-video' width={1000} height={1000} className="mx-auto rounded-[48px]"/>
    <div className="flex justify-between">
      <Image src="/images/partner-logo.svg"  alt="partner-logo" width={150} height={40}/>
      <Image src="/images/partner-logo.svg"  alt="partner-logo" width={150} height={40}/>
      <Image src="/images/partner-logo.svg"  alt="partner-logo" width={150} height={40}/>
      <Image src="/images/partner-logo.svg"  alt="partner-logo" width={150} height={40}/>
    </div>
    </div>

    <Benefits/>
    <Reviews/>






  </main>
</div>
);
}