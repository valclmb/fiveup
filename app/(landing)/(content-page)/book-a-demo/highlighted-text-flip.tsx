"use client";

import { useState } from "react";
import { Highlighter } from "@/components/ui/highlighter";
import { LayoutTextFlip, type LayoutTextFlipProps } from "@/components/ui/layout-text-flip";

type HighlightedTextFlipProps = LayoutTextFlipProps & {
  highlighterAction?: "underline" | "highlight" | "box" | "circle" | "strike-through" | "crossed-off" | "bracket";
  highlighterColor?: string;
};

/**
 * LayoutTextFlip enveloppé dans un Highlighter dont l’annotation est masquée
 * juste avant le changement de mot et réaffichée ~500 ms après pour un rendu plus fluide.
 */
export function HighlightedTextFlip({
  highlighterAction = "underline",
  highlighterColor = "var(--primary)",
  ...layoutProps
}: HighlightedTextFlipProps) {
  const [showUnderline, setShowUnderline] = useState(true);

  return (
    <Highlighter
      action={highlighterAction}
      color={highlighterColor}
      visible={showUnderline}
    >
      <LayoutTextFlip
        {...layoutProps}
        onBeforeFlip={() => setShowUnderline(false)}
        onAfterFlip={() => setShowUnderline(true)}
      />
    </Highlighter>
  );
}
