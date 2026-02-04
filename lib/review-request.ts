/**
 * Configuration des demandes d'avis après commande Shopify.
 * Étape C : délai avant envoi (pour l'instant fixe, plus tard config marchand).
 */

/** Délai en heures avant d'envoyer la demande d'avis (ex: 1 = 1h, 24 = 24h). */
export const REVIEW_REQUEST_DELAY_HOURS = 24;

/** Calcule la date/heure d'envoi programmé (now + délai). */
export function getScheduledAt(delayHours: number = REVIEW_REQUEST_DELAY_HOURS): Date {
  return new Date(Date.now() + delayHours * 60 * 60 * 1000);
}

export const ORDER_REVIEW_STATUS = {
  PENDING: "pending",
  SENT: "sent",
  FAILED: "failed",
} as const;

export type OrderReviewStatus = (typeof ORDER_REVIEW_STATUS)[keyof typeof ORDER_REVIEW_STATUS];
