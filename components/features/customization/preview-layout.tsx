"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import Typography from "@/components/ui/typography";
import { CORNER_ROUNDNESS_PX, DEFAULT_CORNER_ROUNDNESS } from "@/lib/corner-roundness";
import { getAll } from "@/lib/fetch";
import {
  GLOBAL_STYLES_LOGO_QUERY_KEY,
  GLOBAL_STYLES_QUERY_KEY,
} from "@/lib/global-styles-queries";
import type { GlobalStylesValues } from "@/lib/global-styles-values";
import { DEFAULT_GLOBAL_STYLES } from "@/lib/global-styles-values";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Monitor, Smartphone } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

/** Taille logique du rendu + scale. La place réservée = (logicalWidth * scale) x (logicalHeight * scale). */
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

const PREVIEW_BREAKPOINT_KEYS = ["mobile", "desktop"] as const;
export type PreviewLayoutBreakpoint = (typeof PREVIEW_BREAKPOINT_KEYS)[number];

/** Styles utilisés par le cadre de la preview (fond, carte, logo). Réutilisable pour d'autres types de preview. */
export type PreviewLayoutStyles = {
  font: string;
  cornerRoundness: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
  cardColor: string;
};

export type PreviewLayoutProps = {
  /** Optionnel : override des styles (ex. form.watch() pour live preview sur la page Global Styles). Sinon les styles sont récupérés via TanStack Query (cache partagé). */
  stylesOverride?: GlobalStylesValues;
  /** Optionnel : override du logo (ex. blob preview pendant upload). Sinon le logo est récupéré via TanStack Query (cache partagé). */
  logoUrlOverride?: string;
  /** Optionnel : className sur le CardContent. */
  className?: string;
  /** Contenu de la preview, reçoit les styles globaux (résolus via API ou override). */
  children: (styles: GlobalStylesValues) => React.ReactNode;
};

/**
 * Layout de preview réutilisable : onglets (mobile/desktop), zone scalée, fond, logo, carte.
 * Le contenu (ex. formulaire feedback, autre widget) est passé en children.
 */
export function PreviewLayout({
  stylesOverride,
  logoUrlOverride,
  className,
  children,
}: PreviewLayoutProps) {
  const [breakpoint, setBreakpoint] = useState<PreviewLayoutBreakpoint>("mobile");
  const previewBreakpoint = PREVIEW_BREAKPOINTS[breakpoint];

  const { data: globalStylesData } = useQuery({
    queryKey: GLOBAL_STYLES_QUERY_KEY,
    queryFn: () => getAll<GlobalStylesValues>("customization/global-styles"),
  });

  const { data: logoData } = useQuery({
    queryKey: GLOBAL_STYLES_LOGO_QUERY_KEY,
    queryFn: () => getAll<{ brandLogoUrl: string | null }>("customization/global-styles/logo"),
  });

  const styles: GlobalStylesValues =
    stylesOverride ?? globalStylesData ?? DEFAULT_GLOBAL_STYLES;
  const logoUrl = logoUrlOverride ?? logoData?.brandLogoUrl ?? "";

  const {
    font,
    cornerRoundness,
    borderColor,
    bgColor,
    textColor,
    cardColor,
  } = styles;

  const isMobile = breakpoint === "mobile";

  return (
    <div
      className="flex flex-1 flex-col gap-3 transition-all duration-300"
      style={{
        width: previewBreakpoint.logicalWidth * previewBreakpoint.scale,
        height: previewBreakpoint.logicalHeight * previewBreakpoint.scale,
        maxWidth: "100%",
      }}
    >
      <div className="flex items-center justify-between">
        <Tabs value={breakpoint} onValueChange={(v) => v && setBreakpoint(v as PreviewLayoutBreakpoint)}>
          <TabsList>
            {PREVIEW_BREAKPOINT_KEYS.map((key) => {
              const { label, icon: Icon } = PREVIEW_BREAKPOINTS[key];
              return (
                <TabsTab key={key} value={key} title={label} aria-label={`Aperçu ${label}`}>
                  <Icon className="size-4" /> {label}
                </TabsTab>
              );
            })}
          </TabsList>
        </Tabs>
        <Typography variant="p" className="text-muted-foreground text-sm">
          Aperçu
        </Typography>
      </div>

      <div
        className="origin-top-left relative w-full shrink-0 overflow-hidden rounded-xl bg-muted/30 transition-width duration-300"
        style={{
          width: previewBreakpoint.logicalWidth,
          height: previewBreakpoint.logicalHeight,
          transform: `scale(${previewBreakpoint.scale})`,
        }}
      >
        <div
          className="flex h-full w-full flex-col items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          <div className={cn("flex items-center justify-center", isMobile ? "" : "mb-14")}>
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt=""
                className="max-h-16 w-auto object-contain"
                width={100}
                height={100}
                unoptimized
              />
            ) : (
              <div className="flex max-h-16 items-center justify-center text-sm text-muted-foreground">
                Aucun logo
              </div>
            )}
          </div>
          <Card
            className={
              isMobile
                ? "w-full max-w-3xl max-h-max border-0 p-0 shadow-none"
                : "w-full max-w-3xl max-h-max border-1 p-0 shadow-none"
            }
            style={{
              backgroundColor: isMobile ? bgColor : cardColor,
              color: textColor,
              fontFamily: font,
              ...(isMobile ? {} : { borderColor }),
              borderRadius: CORNER_ROUNDNESS_PX[cornerRoundness] ?? CORNER_ROUNDNESS_PX[DEFAULT_CORNER_ROUNDNESS],
            }}
          >
            <CardContent className={className}>{children(styles)}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
