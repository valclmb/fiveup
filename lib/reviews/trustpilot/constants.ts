/**
 * Trustpilot configuration constants
 */

export const TRUSTPILOT_CONSTANTS = {
  /** Minimum days between domain changes for an account */
  DOMAIN_CHANGE_COOLDOWN_DAYS: 30,

  /** Minimum days between automatic syncs (cron) */
  AUTO_SYNC_INTERVAL_DAYS: 7,

  /** Default number of reviews to fetch per Apify run */
  DEFAULT_MAX_ITEMS: 1000,

  /** Default lookback period for initial sync (days) */
  DEFAULT_LOOKBACK_DAYS: 365,

  /** Polling interval for sync status (ms) */
  SYNC_POLL_INTERVAL_MS: 6000,
} as const;
