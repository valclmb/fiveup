"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/** Délai avant le flip pour masquer l’underline (ex. 1 = disparition à interval-1ms). */
const BEFORE_FLIP_MS = 1;
/** Délai après le flip avant de réafficher l’underline (petite pause sur la nouvelle phrase). */
const AFTER_FLIP_MS = 850;

export interface LayoutTextFlipProps {
  /** Phrases à afficher en rotation */
  words: string[];
  /** Intervalle entre chaque flip (ms). Défaut: 3000 */
  interval?: number;
  className?: string;
  /** Appelé juste avant le changement de phrase (par défaut 400 ms avant). */
  onBeforeFlip?: () => void;
  /** Appelé après le changement de phrase (par défaut 500 ms après). */
  onAfterFlip?: () => void;
}

/**
 * Affiche une série de phrases en rotation avec une animation de flip (style Aceternity).
 */
export function LayoutTextFlip({
  words,
  interval = 3000,
  className,
  onBeforeFlip,
  onAfterFlip,
}: LayoutTextFlipProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length <= 1) return;

    const beforeDelay = Math.max(0, interval - BEFORE_FLIP_MS);
    let beforeIntervalId: ReturnType<typeof setInterval> | undefined;

    const flipId = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
      setTimeout(() => onAfterFlip?.(), AFTER_FLIP_MS);
    }, interval);

    const firstBeforeId = setTimeout(() => {
      onBeforeFlip?.();
      beforeIntervalId = setInterval(() => onBeforeFlip?.(), interval);
    }, beforeDelay);

    return () => {
      clearInterval(flipId);
      clearTimeout(firstBeforeId);
      if (beforeIntervalId) clearInterval(beforeIntervalId);
    };
  }, [words.length, interval, onBeforeFlip, onAfterFlip]);

  const currentWord = words[index] ?? words[0];

  return (
    <span className={cn("inline-block overflow-hidden align-middle", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentWord}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          className="inline-block"
        >
          {currentWord}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
