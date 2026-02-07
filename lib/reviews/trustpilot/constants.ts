/**
 * Trustpilot configuration constants
 * Extends shared REVIEWS_CONSTANTS with source-specific values
 */

import { REVIEWS_CONSTANTS } from "../constants";

export const TRUSTPILOT_CONSTANTS = {
  ...REVIEWS_CONSTANTS,

  /** Default number of reviews to fetch per Apify run */
  DEFAULT_MAX_ITEMS: 1000,

  /** Default lookback period for initial sync (days) */
  DEFAULT_LOOKBACK_DAYS: 365,
} as const;
