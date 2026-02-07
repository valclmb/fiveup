/**
 * Shared review sources configuration (Trustpilot + Google)
 */

export const REVIEWS_CONSTANTS = {
  /** Minimum days between source changes (domain for Trustpilot, place for Google) */
  SOURCE_CHANGE_COOLDOWN_DAYS: 30,

  /** Minimum days between automatic syncs (cron) */
  AUTO_SYNC_INTERVAL_DAYS: 7,

  /** Polling interval for sync status (ms) */
  SYNC_POLL_INTERVAL_MS: 6000,
} as const;
