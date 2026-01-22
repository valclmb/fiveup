import AnimatedBackground from "../components/animated-background";
import Footer from "../components/footer";
import Header from "../components/header";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (<>
    <AnimatedBackground />
    <div className="flex flex-col min-h-screen items-center justify-center bg-background font-sans">
      <Header />

      <main className="overflow-hidden md:overflow-visible flex min-h-screen w-full max-w-7xl flex-col items-center space-y-8 md:space-y-36 p-4 mt-8 md:mt-14 md:p-4 sm:items-start">
        {children}
      </main>
      <Footer />
    </div>
  </>
  );
}
