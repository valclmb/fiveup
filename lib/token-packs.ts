/**
 * Token pack definitions and cost constants for the buy-tokens page.
 * Kept in a separate file so Client Components can import without pulling in Prisma/pg.
 */

export const TOKEN_COST_EMAIL = 1;
export const TOKEN_COST_SMS = 3;
export const TOKEN_COST_WHATSAPP = 5;

/** Price per token in EUR for custom amount (slider). Derived from pack 100 = 9€. */
export const PRICE_PER_TOKEN_EUR = 0.09;

/** Min/max tokens for custom amount purchase. */
export const CUSTOM_AMOUNT_MIN = 50;
export const CUSTOM_AMOUNT_MAX = 10_000;

/** Compute total price in EUR for a custom token amount. */
export function getCustomAmountPriceEur(amount: number): number {
  return Math.round(amount * PRICE_PER_TOKEN_EUR * 100) / 100;
}

export const TOKEN_PACKS = [
  { id: "pack_100", tokens: 100, priceIdEnv: "STRIPE_PRICE_ID_TOKENS_100", label: "100 tokens", priceEur: 9 },
  { id: "pack_500", tokens: 500, priceIdEnv: "STRIPE_PRICE_ID_TOKENS_500", label: "500 tokens", priceEur: 39 },
  { id: "pack_1500", tokens: 1500, priceIdEnv: "STRIPE_PRICE_ID_TOKENS_1500", label: "1,500 tokens", priceEur: 99 },
  { id: "pack_5000", tokens: 5000, priceIdEnv: "STRIPE_PRICE_ID_TOKENS_5000", label: "5,000 tokens", priceEur: 299 },
] as const;
