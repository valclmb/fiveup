"use client";

import { StarIcon } from "@/app/(landing)/components/star-icon";
import { Check, Pointer } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export interface ArcStarsSelectorProps {
  /** Nombre d'étoiles sélectionnées (0–5). Contrôlé par le parent si fourni. */
  value?: number;
  /** Appelé quand la sélection change. */
  onChange?: (value: number) => void;
  /** Appelé quand l'utilisateur atteint 5 étoiles. */
  onComplete?: () => void;
  /** Nombre d'étoiles affichées (défaut 5). */
  starCount?: number;
  /** Taille du conteneur en px (défaut 280). */
  size?: number;
  /** Couleur de fond du bouton central (ex. hex). */
  buttonBgColor?: string;
  /** Couleur du texte/icône du bouton. */
  buttonTextColor?: string;
  /** Couleur des étoiles. */
  starsColor?: string;
  className?: string;
}

const DEFAULT_BUTTON_BG = "hsl(var(--primary))";
const DEFAULT_BUTTON_TEXT = "white";
const DEFAULT_STARS_COLOR = "#fcd34d"; // amber-300

export function ArcStarsSelector({
  value: controlledValue,
  onChange,
  onComplete,
  starCount = 5,
  size = 280,
  buttonBgColor = DEFAULT_BUTTON_BG,
  buttonTextColor = DEFAULT_BUTTON_TEXT,
  starsColor = DEFAULT_STARS_COLOR,
  className,
}: ArcStarsSelectorProps) {
  const [internalValue, setInternalValue] = useState(0);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  /** Une fois à 5 étoiles, on garde le Check même si l'utilisateur revient en arrière. */
  const [hasReachedMax, setHasReachedMax] = useState(false);

  const isControlled = controlledValue !== undefined;
  const active = isControlled ? controlledValue : internalValue;

  const setActive = (updater: (prev: number) => number) => {
    const next = updater(active);
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
    if (next === starCount) {
      setHasReachedMax(true);
      onComplete?.();
    }
  };

  const handleTap = () => {
    setActive((curr) => (curr < starCount ? curr + 1 : curr));
  };

  const handleStarClick = (starIndex: number) => {
    setActive(() => starIndex);
  };

  const radius = size * 0.32;
  const startAngle = 180;
  const arcAngle = -180;

  const getStarPosition = (index: number) => {
    const angle = startAngle + (arcAngle / (starCount - 1)) * index;
    const angleRad = (angle * Math.PI) / 180;
    const x = Math.cos(angleRad) * radius;
    const y = -Math.sin(angleRad) * radius;
    return { x, y };
  };

  const starSize = 42;

  return (
    <div
      className={className}
      style={{ width: size, height: size }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <motion.button
          type="button"
          onClick={handleTap}
          className="cursor-pointer z-10 relative flex items-center justify-center px-4 py-2 size-24 rounded-full transition-all shadow-xl active:shadow-md"
          style={{
            backgroundColor: buttonBgColor,
            color: buttonTextColor,
          }}
        >
          <motion.div
            style={{
              perspective: "1000px",
              transformStyle: "preserve-3d",
              color: buttonTextColor,
            }}
            animate={{
              rotateX: [0, -25, 0, -25, 0],
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
              repeat: Infinity,
              repeatDelay: 2,
            }}
            className="z-10 flex items-center justify-center"
          >
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex items-center justify-center z-10"
            >
              {hasReachedMax ? (
                <Check size={42} style={{ color: buttonTextColor }} />
              ) : (
                <Pointer size={42} style={{ color: buttonTextColor }} />
              )}
            </motion.span>
          </motion.div>
        </motion.button>
        <div className="absolute inset-0">
          {Array.from({ length: starCount }, (_, i) => i + 1).map((starIndex) => {
            const position = getStarPosition(starIndex - 1);
            const isActive = active >= starIndex;

            return (
              <motion.div
                key={starIndex}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={
                  isActive
                    ? {
                      x: position.x - starSize / 2,
                      y: position.y - starSize / 2,
                      opacity: 1,
                      scale: 1,
                    }
                    : { x: 0, y: 0, opacity: 0, scale: 0 }
                }
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="z-0 absolute"
                style={{ left: "50%", top: "50%" }}
                onMouseEnter={() => setHoveredStar(starIndex)}
                onMouseLeave={() => setHoveredStar(null)}
                onClick={() => handleStarClick(starIndex)}
              >
                <StarIcon
                  size={starSize}
                  color={starsColor}
                  className={`hover:scale-110 transition-all duration-300 ${hoveredStar !== null && starIndex <= hoveredStar ? "brightness-80" : ""}`}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
