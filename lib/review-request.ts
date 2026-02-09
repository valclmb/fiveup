/**
 * Configuration des demandes d'avis après commande Shopify.
 * Étape C : délai avant envoi (from UserCampaign config).
 */

/** Calcule la date/heure d'envoi programmé (now + délai). */
export function getScheduledAt(delayHours: number): Date {
  return new Date(Date.now() + delayHours * 60 * 60 * 1000);
}

export const ORDER_REVIEW_STATUS = {
  PENDING: "pending",
  SENT: "sent",
  FAILED: "failed",
} as const;

export type OrderReviewStatus = (typeof ORDER_REVIEW_STATUS)[keyof typeof ORDER_REVIEW_STATUS];
