export type CornerRoundness = "none" | "sm" | "md" | "lg" | "rounded";

/** Valeurs en pixels pour les options de coins (none, sm, md, lg, rounded). */
export const CORNER_ROUNDNESS_PX: Record<string, string> = {
  none: "0",
  sm: "6px",
  md: "10px",
  lg: "14px",
  rounded: "20px",
};

export const DEFAULT_CORNER_ROUNDNESS = "md";
