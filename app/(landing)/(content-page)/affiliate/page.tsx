import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import Typography, { headingFontClassName } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { ContentPageTemplate } from "../../components/content-page-template";

export default function AffiliatePage() {
  return (
    <ContentPageTemplate
      badge="Affiliate"
      title={
        <>
          <Typography variant="h1" className="text-4xl md:text-5xl font-bold">
            Become an affiliate
          </Typography>
          <LayoutTextFlip
            words={["Get paid for referring customers.", "Earn money for every sale.", "Start earning today."]}
            interval={3500}
            className={cn(headingFontClassName, "text-4xl md:text-5xl font-bold tracking-tight")}
          />
        </>
      }
      description="Become an affiliate and earn money for every sale you refer."
    >
      AFFILIATE
    </ContentPageTemplate>
  );
}