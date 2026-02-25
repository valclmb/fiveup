import Footer from "@/components/landing/footer";
import { LandingHeader } from "@/components/landing/header/header";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background  flex flex-col">
      <LandingHeader />
      <div className="overflow-hidden  px-4 lg:px-18">
        {children}
      </div>

      <Footer />
    </div>
  );
}
