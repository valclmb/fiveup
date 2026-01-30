"use client";

import { StarIcons } from "@/app/(landing)/components/star-icon";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/typography";
import { CORNER_ROUNDNESS_PX, DEFAULT_CORNER_ROUNDNESS } from "@/lib/corner-roundness";
import type { GlobalStylesValues } from "@/lib/global-styles-values";
import { ArcStarsSelector } from "../../rating";

export type ReviewPagePreviewProps = {
  styles: GlobalStylesValues;
  content: {
    title: string;
    buttonText: string;
    ratingTemplate: string;
  }
};

/**
 * Aperçu spécifique à la page Review (titre, étoiles, texte).
 * À placer dans un PreviewLayout avec les global styles.
 */
export function ReviewPagePreview({ styles, content }: ReviewPagePreviewProps) {
  const {
    font,
    cornerRoundness,
    buttonCornerRoundness,
    borderColor,
    buttonBgColor,
    buttonTextColor,
    starsColor,
  } = styles;

  const { title, buttonText, ratingTemplate } = content;

  return (
    <>
      <div className="min-w-0 space-y-10 ">
        <Typography variant="h2" style={{ fontFamily: font }} className="mb-2 min-w-0 text-2xl ">
          {title}
        </Typography>



        {ratingTemplate === "arc-stars" && (<div className="flex justify-center mt-5">
          <ArcStarsSelector {...styles} />   </div>
        )}


        {ratingTemplate === "classic" && (<>
          <StarIcons size={40} />
          <Button className="w-full" style={{ backgroundColor: buttonBgColor, color: buttonTextColor, borderRadius: CORNER_ROUNDNESS_PX[buttonCornerRoundness] ?? CORNER_ROUNDNESS_PX[DEFAULT_CORNER_ROUNDNESS] }}>{buttonText}</Button>
        </>
        )}
      </div>

    </>
  );
}
