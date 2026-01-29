"use client";

import { DesignSystemFont } from "@/components/custom-ui/font-select";
import { FeedbackForm } from "@/components/features/feedback/feedback-form";

import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import Typography from "@/components/ui/typography";
import type { FeedbackFormStyles } from "@/lib/feedback-form-styles";
import { Monitor, Smartphone } from "lucide-react";
import { useMemo, useState } from "react";
import { CornerRoundness } from "./customization-global";

/** Taille logique du rendu + scale. La place réservée dans le layout = (logicalWidth * scale) x (logicalHeight * scale). */
export const PREVIEW_BREAKPOINTS = {
  mobile: {
    label: "Mobile",
    icon: Smartphone,
    logicalWidth: 375,
    logicalHeight: 667,
    scale: 1,
  },
  desktop: {
    label: "Desktop",
    icon: Monitor,
    logicalWidth: 1920,
    logicalHeight: 1080,
    scale: 0.43,
  },
} as const;


interface CustomizationPreviewProps {
  logoUrl: string | null;
  styles: {
    font: DesignSystemFont;
    cornerRoundness: CornerRoundness;
    buttonCornerRoundness: CornerRoundness;
    borderColor: string;
    buttonBgColor: string;
    buttonTextColor: string;
    starsColor: string;
    bgColor: string;
    textColor: string;
    cardColor: string;

  };
}


function toFeedbackFormStyles(
  s: CustomizationPreviewProps["styles"]
): FeedbackFormStyles {
  return {
    font: s.font,
    cornerRoundness: s.cornerRoundness,
    buttonCornerRoundness: s.buttonCornerRoundness,
    borderColor: s.borderColor,
    buttonBgColor: s.buttonBgColor,
    buttonTextColor: s.buttonTextColor,
    starsColor: s.starsColor,
    bgColor: s.bgColor,
    textColor: s.textColor,
    cardColor: s.cardColor,
  };
}

export const CustomizationPreview = ({ logoUrl, styles }: CustomizationPreviewProps) => {
  const formStyles = useMemo(() => toFeedbackFormStyles(styles), [styles]);

  const [breakpoint, setBreakpoint] = useState("mobile");
  const previewBreakpoint = PREVIEW_BREAKPOINTS[breakpoint as keyof typeof PREVIEW_BREAKPOINTS];

  return (
    <div className="flex flex-col flex-1 gap-3 transition-all duration-300"
      style={{
        width: previewBreakpoint.logicalWidth * previewBreakpoint.scale,
        height: previewBreakpoint.logicalHeight * previewBreakpoint.scale,
        maxWidth: "100%",
      }}
    >
      <div className="flex items-center justify-between">
        <Tabs
          value={breakpoint}
          onValueChange={(v) => v && setBreakpoint(v)}
        >
          <TabsList>


            {(Object.entries(PREVIEW_BREAKPOINTS)).map(
              ([key, { label, icon: Icon }]) => (
                <TabsTab
                  key={key}
                  value={key}
                  title={label}
                  aria-label={`Aperçu ${label}`}
                >
                  <Icon className="size-4" /> {label}
                </TabsTab>
              )
            )}
          </TabsList>
        </Tabs>


        <Typography variant="p" className="text-muted-foreground text-sm">Aperçu</Typography>
      </div>


      <div
        className="origin-top-left relative w-full  shrink-0 overflow-hidden rounded-xl bg-muted/30 transition-width duration-300 "
        style={{
          width: previewBreakpoint.logicalWidth,
          height: previewBreakpoint.logicalHeight,
          transform: `scale(${previewBreakpoint.scale})`,

        }}
      >
        <FeedbackForm
          styles={formStyles}
          logoUrl={logoUrl ?? ""}
          breakpoint={breakpoint as "mobile" | "desktop"}
          className="flex h-full w-full flex-col gap-4 rounded-md py-8 px-6"
        />
      </div>
    </div >
  );
};