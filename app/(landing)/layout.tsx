import Footer from "@/components/landing/footer";
import { LandingHeader } from "@/components/landing/header/header";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background px-4 lg:px-18  flex flex-col overflow-hidden">
      <LandingHeader />
      {children}
      <Footer />
    </div>
  );
}
