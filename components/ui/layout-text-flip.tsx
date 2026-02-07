"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export interface LayoutTextFlipProps {
  /** Phrases à afficher en rotation */
  words: string[];
  /** Intervalle entre chaque flip (ms). Défaut: 3000 */
  interval?: number;
  className?: string;
}

/**
 * Affiche une série de phrases en rotation avec une animation de flip (style Aceternity).
 */
export function LayoutTextFlip({
  words,
  interval = 3000,
  className,
}: LayoutTextFlipProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

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
