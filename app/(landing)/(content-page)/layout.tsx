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
  return (
    <div className="w-full max-w-7xl mx-auto space-y-32 py-2 px-4 z-90">
      {children}
      <Faq />
      <Cta />
    </div>
  );
}
