import { z } from "zod";

/**
 * Schéma Zod pour une couleur hex CSS (#RRGGBB ou #RRGGBBAA).
 * z.hex() de Zod valide les chaînes hex sans # ; ce schéma valide les couleurs hex avec #.
 */
export const hexColorSchema = z
  .string()
  .regex(
    /^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/,
    "Invalid hex color (e.g. #FF0000 or #FF0000FF)",
  )
  .transform((val) => val.toUpperCase());
