import Cta from "../components/cta";
import Faq from "../components/faq";

/**
 * Layout shared by content pages (book-a-demo, affiliate, etc.)
 * Structure: container → children → FAQ → CTA
 */
export default function ContentPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (<>
    <div className="absolute inset-0 ">
      <div className="z-30 absolute -top-20 right-1/2 translate-x-1/2 h-[400px] blur-[100px]  w-1/2 bg-tertiary" />
      <div className="z-20 absolute top-0 h-[800px] w-full bg-gradient-to-b from-background to-transparent" />
      <div className=" z-10 absolute min-w-[1400px] h-full border-x bg-linear-to-b translate-x-1/2 right-1/2 " />
      <div className="z-0 absolute top-[750px] h-[600px] border-t w-full bg-gradient-to-b from-tertiary/40 to-transparent" />
      <div className="absolute top-[2050px]  w-full h-1 border-t translate-x-1/2 right-1/2 " />
      <div className="z-20 absolute top-[1200px] h-[1700px] w-full bg-[linear-gradient(to_bottom,transparent_20%,var(--background)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--background)_0%,transparent_20%,transparent_70%,var(--background)_100%)]" />
    </div>

    <div className="w-full  mx-auto space-y-32 z-90" >
      {children}

      <Faq />
      <Cta />
    </div>
  </ >
  );
}
