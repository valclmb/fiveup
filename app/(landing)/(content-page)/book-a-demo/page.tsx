import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import Typography, { headingFontClassName } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { ContentPageTemplate } from "../../components/content-page-template";
import { CalEmbed, type CalEmbedTheme } from "./cal-embed";
import { CallAgenda } from "./call-agenda";

const CALCOM_LINK = process.env.NEXT_PUBLIC_CALCOM_LINK ?? "";
const CALCOM_NAMESPACE = process.env.NEXT_PUBLIC_CALCOM_NAMESPACE ?? "30min";

const CALCOM_THEME = (process.env.NEXT_PUBLIC_CALCOM_THEME ?? "light") as CalEmbedTheme;
const themeOk: CalEmbedTheme[] = ["light", "dark", "system"];
const calcomTheme: CalEmbedTheme = themeOk.includes(CALCOM_THEME) ? CALCOM_THEME : "light";

export default function MeetPage() {
  return (
    <ContentPageTemplate
      badge="Demo"
      title={
        <>
          <Typography variant="h1" className="text-4xl md:text-5xl font-bold">
            See how we help you
          </Typography>
          <LayoutTextFlip
            words={["Get more reviews.", "Build more trust.", "Sell more."]}
            interval={3500}
            className={cn(headingFontClassName, "text-4xl md:text-5xl font-bold tracking-tight")}
          />
        </>
      }
      description="Automate review requests. Capture feedback at the perfect moment and turn satisfied customers into 5-star reviews."
    >
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 items-start">
        <div>
          <CallAgenda />
        </div>
        <div className="min-w-0 lg:sticky lg:top-28">
          <CalEmbed
            calLink={CALCOM_LINK}
            namespace={CALCOM_NAMESPACE}
            theme={calcomTheme}
          />
        </div>
      </div>
    </ContentPageTemplate>
  );
}