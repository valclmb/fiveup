"use client";

import Typography from "@/components/ui/typography";
import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect, useState } from "react";

const CALENDAR_MIN_HEIGHT = 500;
const LOADING_TIMEOUT = 8000;
const BRAND_COLOR = "#000000";

type CalEmbedProps = {
  calLink: string;
  namespace?: string;
  theme?: "light" | "dark" | "system";
  className?: string;
};

export function CalEmbed({
  calLink,
  namespace = "30min",
  theme = "light",
  className,
}: CalEmbedProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const themeForCal = theme === "system" ? undefined : theme;

  useEffect(() => {
    if (!calLink.trim()) {
      setError("Cal.com link is missing");
      setIsLoading(false);
    }
  }, [calLink]);

  useEffect(() => {
    if (!calLink.trim()) return;

    let cancelled = false;
    const timer = setTimeout(() => !cancelled && setIsLoading(false), LOADING_TIMEOUT);

    getCalApi({ namespace })
      .then((cal) => {
        if (cancelled) return;

        cal("ui", {
          hideEventTypeDetails: false,
          layout: "month_view",
          theme: themeForCal,
          styles: { branding: { brandColor: BRAND_COLOR } },
        });

        cal("on", {
          action: "linkReady",
          callback: () => {
            if (!cancelled) {
              clearTimeout(timer);
              setIsLoading(false);
            }
          },
        });

        cal("on", {
          action: "bookingSuccessful",
          callback: (e: { detail?: unknown }) => console.log("✅ Booking:", e.detail),
        });
      })
      .catch((err) => {
        console.error("Cal.com error:", err);
        if (!cancelled) {
          clearTimeout(timer);
          setError("Failed to load calendar");
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [calLink, namespace, themeForCal]);

  if (!calLink.trim() || error) {
    return (
      <div className="w-full max-w-md mx-auto py-12 text-center space-y-4">
        <div className="text-6xl">📅</div>
        <Typography variant="h3">Calendar unavailable</Typography>
        <Typography variant="description" className="text-muted-foreground">
          {error || "Configuration missing"}
        </Typography>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full rounded-xl border bg-card shadow-lg overflow-hidden ${className ?? ""}`}
      style={{ minHeight: CALENDAR_MIN_HEIGHT }}
    >
      <Cal
        namespace={namespace}
        calLink={calLink.trim()}
        style={{ width: "100%", minHeight: CALENDAR_MIN_HEIGHT }}
        config={{
          layout: "month_view",
          useSlotsViewOnSmallScreen: "true",
          ...(themeForCal && { theme: themeForCal }),
        }}
      />

      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-card rounded-xl">
          <div className="space-y-4 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
            <Typography variant="p" affects="small" className="text-muted-foreground">
              Loading calendar...
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
}