import { LandingHeader } from "@/components/landing/header";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background p-18 pt-4 flex flex-col overflow-hidden">
      <LandingHeader />
      {children}
    </div>
  );
}
