"use client";

import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/typography";
import { CORNER_ROUNDNESS_PX, DEFAULT_CORNER_ROUNDNESS } from "@/lib/corner-roundness";
import type { GlobalStylesValues } from "@/lib/global-styles-values";

export type RedirectionPagePreviewProps = {
  styles: GlobalStylesValues;
  content: {
    title: string;
    buttonText: string;
    description?: { enabled: boolean; content: string };
  };
};

/**
 * Aperçu spécifique à la page Redirection (titre + bouton).
 * Les variables `title` et `buttonText` sont exposées pour le style.
 * À placer dans un PreviewLayout avec les global styles.
 */
export function RedirectionPagePreview({
  styles,
  content,
}: RedirectionPagePreviewProps) {
  const {
    font,
    cornerRoundness,
    buttonCornerRoundness,
    buttonBgColor,
    buttonTextColor,
  } = styles;

  const { title, buttonText, description } = content;
  const showDescription = description?.enabled && description?.content;

  return (
    <div className="min-w-0 space-y-5">
      <Typography
        variant="h2"
        style={{ fontFamily: font }}
        className="mb-2 min-w-0 text-2xl"
      >
        {title}
      </Typography>
      {showDescription && (
        <Typography
          variant="description"
          affects="muted"
          style={{ fontFamily: font }}
          className="break-words"
        >
          {description.content}
        </Typography>
      )}
      <Button
        className="w-full"
        style={{
          backgroundColor: buttonBgColor,
          color: buttonTextColor,
          borderRadius:
            CORNER_ROUNDNESS_PX[buttonCornerRoundness] ??
            CORNER_ROUNDNESS_PX[DEFAULT_CORNER_ROUNDNESS],
        }}
      >
        {buttonText}
      </Button>
    </div>
  );
}
