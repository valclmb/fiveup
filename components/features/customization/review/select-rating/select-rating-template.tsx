"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRef, useState } from "react";

export const RATING_TEMPLATE_IDS = ["arc-stars", "classic"] as const;
export type RatingTemplateId = (typeof RATING_TEMPLATE_IDS)[number];

interface TemplateConfig {
  id: RatingTemplateId;
  label: string;
  /** Image statique affichée par défaut (PNG/JPG). */
  previewStatic: string;
  /** Vidéo MP4 jouée au survol (recommandé : plus léger et fiable que GIF). */
  previewVideo?: string;
}

// width 300px height 250px
const RATING_TEMPLATES: TemplateConfig[] = [
  {
    id: "classic",
    label: "Classic",
    previewStatic: "/rating-previews/classic2.png",
    previewVideo: "/rating-previews/classic.mp4",
  },
  {
    id: "arc-stars",
    label: "Arc Stars",
    previewStatic: "/rating-previews/arc-stars.png",
    previewVideo: "/rating-previews/arc-stars.mp4",
  },
];

export interface SelectRatingTemplateProps {
  value: string;
  onChange: (templateId: string) => void;
  label?: string;
  className?: string;
}

export function SelectRatingTemplate({
  value,
  onChange,
  label = "Type de notation",
  className,
}: SelectRatingTemplateProps) {
  const [hoveredId, setHoveredId] = useState<RatingTemplateId | null>(null);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const videoRefs = useRef<Partial<Record<RatingTemplateId, HTMLVideoElement>>>({});
  const hoveredIdRef = useRef<RatingTemplateId | null>(null);

  const handleMouseEnter = (templateId: RatingTemplateId) => {
    hoveredIdRef.current = templateId;
    setHoveredId(templateId);
    const video = videoRefs.current[templateId];
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => { });
    }
  };

  const handleMouseLeave = (templateId: RatingTemplateId) => {
    hoveredIdRef.current = null;
    const video = videoRefs.current[templateId];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setHoveredId(null);
  };

  const handleVideoEnded = (templateId: RatingTemplateId) => {
    if (hoveredIdRef.current !== templateId) return;
    const video = videoRefs.current[templateId];
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => { });
    }
  };

  return (
    <Field className={cn("min-w-0", className)}>
      <FieldLabel id="select-rating-template-label">{label}</FieldLabel>
      <div
        role="radiogroup"
        aria-labelledby="select-rating-template-label"
        className="grid grid-cols-2 gap-3"
      >
        {RATING_TEMPLATES.map((template) => {
          const isSelected = value === template.id;
          const isHovered = hoveredId === template.id;
          const showVideo = template.previewVideo && isHovered;

          return (
            <button
              key={template.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(template.id)}
              onMouseEnter={() => handleMouseEnter(template.id)}
              onMouseLeave={() => handleMouseLeave(template.id)}
              className={cn(
                "flex flex-col items-center overflow-hidden rounded-xl border-2 bg-muted/30 transition-all",
                "hover:border-primary/50 hover:bg-muted/50",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isSelected
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border"
              )}
            >
              <div className="relative h-[105px] w-full overflow-hidden bg-muted/20 p-2">
                {imageError[template.id] ? (
                  <span className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">
                    Aperçu
                  </span>
                ) : (
                  <>
                    <Image
                      src={template.previewStatic}
                      alt=""
                      fill
                      className={cn(
                        "absolute inset-0 w-full h-full object-cover transition-opacity",
                        showVideo ? "opacity-0 pointer-events-none" : "opacity-100"
                      )}
                      onError={() =>
                        setImageError((prev) => ({ ...prev, [template.id]: true }))
                      }
                    />
                    {template.previewVideo && (
                      <video
                        ref={(el) => {
                          if (el) videoRefs.current[template.id] = el;
                        }}
                        src={template.previewVideo}
                        muted
                        loop
                        playsInline
                        onEnded={() => handleVideoEnded(template.id)}
                        className={cn(
                          "absolute inset-0 h-full w-full bg-muted/20 object-cover transition-all",
                          showVideo ? "opacity-100 " : "opacity-0  pointer-events-none"
                        )}
                      />
                    )}
                  </>
                )}
              </div>
              <div className="flex w-full items-center justify-center gap-2 border-t border-border/50 bg-background/50 px-3 py-2">

                <span className="text-sm font-medium">{template.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </Field>
  );
}
