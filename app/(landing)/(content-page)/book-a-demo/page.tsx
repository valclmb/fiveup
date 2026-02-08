import Typography, { headingFontClassName } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { ContentPageTemplate } from "../../components/content-page-template";
import { CalEmbed } from "./cal-embed";
import { CallAgenda } from "./call-agenda";
import { HighlightedTextFlip } from "./highlighted-text-flip";

const CALCOM_LINK = process.env.NEXT_PUBLIC_CALCOM_LINK ?? "";

export default function MeetPage() {
  return (
    <ContentPageTemplate
      badge="Demo"
      title={
        <>
          <Typography variant="h1" className="text-4xl md:text-5xl font-bold">
            See how we help you
          </Typography>
          <HighlightedTextFlip
            words={["Get more reviews.", "Build more trust.", "Sell more."]}
            interval={3500}
            className={cn(
              headingFontClassName,
              "text-4xl md:text-5xl font-bold tracking-tight"
            )}
            highlighterAction="underline"
            highlighterColor="var(--primary)"
          />
        </>
      }
      description="Automate review requests. Capture feedback at the perfect moment and turn satisfied customers into 5-star reviews."
    >
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 items-start">
        <CallAgenda />

        <div className="lg:sticky lg:top-28">
          <CalEmbed calLink={CALCOM_LINK} />
        </div>
      </div>
    </ContentPageTemplate>
  );
}