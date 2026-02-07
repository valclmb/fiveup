import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { Badge } from "@/components/ui/badge";
import Typography, { headingFontClassName } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { CalEmbed, type CalEmbedTheme } from "./cal-embed";
import { CallAgenda } from "./call-agenda";
import Faq from "../components/faq";

const CALCOM_LINK = process.env.NEXT_PUBLIC_CALCOM_LINK ?? "";
const CALCOM_NAMESPACE = process.env.NEXT_PUBLIC_CALCOM_NAMESPACE ?? "30min";

const CALCOM_THEME = (process.env.NEXT_PUBLIC_CALCOM_THEME ?? "light") as CalEmbedTheme;
const themeOk: CalEmbedTheme[] = ["light", "dark", "system"];
const calcomTheme: CalEmbedTheme = themeOk.includes(CALCOM_THEME) ? CALCOM_THEME : "light";

export default function MeetPage() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-12 py-2 px-4">
      <div className="text-center space-y-8">
        <div className="flex flex-col items-center gap-5 -mt-4">
          <Badge variant="secondary" className="-mt-2">Demo</Badge>
          <Typography variant="h1" className="text-4xl md:text-5xl font-bold">
            See how we help you
          </Typography>
          <LayoutTextFlip
            words={["Get more reviews.", "Build more trust.", "Sell more."]}
            interval={3500}
            className={cn(headingFontClassName, "text-4xl md:text-5xl font-bold tracking-tight")}
          />
        </div>
        <Typography variant="p" affects="lead" className="text-muted-foreground max-w-2xl mx-auto text-lg pt-2">
          Automate review requests. Capture feedback at the perfect moment and turn satisfied customers into 5-star reviews.
        </Typography>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 items-start">
        <div className="lg:sticky lg:top-6">
          <CallAgenda />
        </div>
        <div className="min-w-0">
          <CalEmbed
            calLink={CALCOM_LINK}
            namespace={CALCOM_NAMESPACE}
            theme={calcomTheme}
          />
        </div>
      </div>

      <Faq />
    </div>
  );
}