"use client";

import Typography from "@/components/ui/typography";
import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect, useState } from "react";

export type CalEmbedTheme = "light" | "dark" | "system";

type CalEmbedProps = {
  calLink: string;
  /** Namespace optionnel (ex. "30min") pour getCalApi ui config. */
  namespace?: string;
  /** Thème de l'embed : light, dark, ou system (préférence du visiteur). */
  theme?: CalEmbedTheme;
  className?: string;
};

/**
 * Intégration Cal.com via @calcom/embed-react : vue mois, slots sur mobile.
 * calLink : identifiant Cal.com (ex. "fiveup-lucas/30min").
 */
export function CalEmbed({
  calLink,
  namespace = "30min",
  theme = "light",
  className
}: CalEmbedProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Le package n'expose que "light" | "dark" ; pour "system" on ne passe pas theme (défaut embed).
  const themeForCal = theme === "system" ? undefined : theme;

  useEffect(() => {
    if (!calLink.trim()) {
      setError("Cal.com is not configured (NEXT_PUBLIC_CALCOM_LINK missing).");
      setIsLoading(false);
      return;
    }
    setError(null);
  }, [calLink]);

  useEffect(() => {
    if (!calLink.trim()) return;

    let cancelled = false;

    // Timeout de secours : si linkReady ne se déclenche pas (iframe cachée, API différente), on masque le loading
    const fallbackTimer = setTimeout(() => {
      if (!cancelled) setIsLoading(false);
    }, 8000);

    (async function () {
      try {
        const cal = await getCalApi({ namespace });
        if (cancelled) return;

        cal("ui", {
          hideEventTypeDetails: false,
          layout: "month_view",
          theme: themeForCal,
          styles: {
            branding: {
              brandColor: "#000000",
            },
          },

        });

        cal("on", {
          action: "linkReady",
          callback: () => {
            if (!cancelled) {
              clearTimeout(fallbackTimer);
              setIsLoading(false);
            }
          },
        });

        cal("on", {
          action: "bookingSuccessful",
          callback: (e: { detail?: unknown }) => {
            console.log("✅ Booking successful", e.detail);
          },
        });
      } catch (err) {
        console.error("Cal.com setup error:", err);
        if (!cancelled) {
          clearTimeout(fallbackTimer);
          setError("Failed to load calendar. Please try again later.");
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(fallbackTimer);
    };
  }, [calLink, namespace, themeForCal]);

  // Gestion d'erreur user-friendly
  if (!calLink.trim() || error) {
    return (
      <div className="w-full max-w-md mx-auto py-12 text-center space-y-4">
        <div className="text-6xl">📅</div>
        <Typography variant="h3">Calendar temporarily unavailable</Typography>
        <Typography variant="description" className="text-muted-foreground">
          {error || "Configuration missing"}
        </Typography>
      </div>
    );
  }

  return (
    <div className={`relative w-full rounded-xl border bg-card shadow-lg overflow-hidden min-h-[500px] ${className ?? ""}`}>
      {/* Cal.com embed toujours monté pour que l'iframe charge et déclenche linkReady */}
      <Cal
        namespace={namespace}
        calLink={calLink.trim()}
        style={{
          width: "100%",
          minHeight: 500,
        }}
        config={{
          layout: "month_view",
          useSlotsViewOnSmallScreen: "true",
          ...(themeForCal && { theme: themeForCal }),
        }}
      />

      {/* Overlay de chargement par-dessus (l'iframe charge en dessous) */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-card">
          <div className="space-y-4 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <Typography variant="p" affects="small" className="text-muted-foreground">
              Loading calendar...
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
}