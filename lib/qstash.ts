import { Client } from "@upstash/qstash";
import { REVIEWS_CONSTANTS } from "@/lib/reviews/constants";

function getQStashClient(): Client | null {
  const token = process.env.QSTASH_TOKEN;
  if (!token) return null;
  return new Client({ token });
}

/** URL de base de l'app (sans slash final) pour les callbacks QStash. */
function getBaseUrl(): string {
  const base = process.env.BETTER_AUTH_URL ?? process.env.VERCEL_URL ?? "";
  const withProtocol =
    base.startsWith("http") ? base : base ? `https://${base}` : "";
  return withProtocol.replace(/\/+$/, "");
}

/** Délai accepté par QStash : nombre (secondes) ou chaîne type "1h", "24h", "2m". */
type QStashDelay = number | `${number}s` | `${number}m` | `${number}h` | `${number}d`;

/**
 * Schedules the next periodic review sync for a given account (Trustpilot or Google).
 * Called after a sync completes - schedules the next sync for AUTO_SYNC_INTERVAL_DAYS later.
 * Each account syncs exactly X days after its last sync (user-centric).
 *
 * @param accountId - ReviewAccount id
 * @param delay - Delay until next sync (default: from REVIEWS_CONSTANTS.AUTO_SYNC_QSTASH_DELAY)
 * @returns messageId if scheduled, null if QStash not configured
 */
export async function scheduleNextReviewSync(
  accountId: string,
  delay: QStashDelay | string = REVIEWS_CONSTANTS.AUTO_SYNC_QSTASH_DELAY,
): Promise<string | null> {
  const client = getQStashClient();
  if (!client) {
    console.warn("QStash: QSTASH_TOKEN not configured, next review sync not scheduled");
    return null;
  }

  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    console.warn("QStash: BETTER_AUTH_URL or VERCEL_URL missing, next review sync not scheduled");
    return null;
  }

  const url = `${baseUrl}/api/reviews/sync-scheduled`;

  try {
    const res = await client.publishJSON({
      url,
      body: { accountId },
      delay: delay as QStashDelay & (number | `${bigint}s` | `${bigint}m` | `${bigint}h` | `${bigint}d`),
    });
    const messageId = Array.isArray(res) ? res[0]?.messageId : (res as { messageId?: string }).messageId;
    console.log(`[QStash] Next review sync scheduled for account ${accountId} in ${delay}`);
    return messageId ?? null;
  } catch (err) {
    console.error("QStash scheduleNextReviewSync error:", err);
    return null;
  }
}

/**
 * Programme un job QStash pour appeler /api/send-review-message à la date/heure prévue.
 * Étape D : après avoir sauvegardé la commande en BDD, on enregistre le job chez QStash.
 *
 * @param orderReviewRequestId - id de l'OrderReviewRequest en BDD
 * @param delay - délai relatif (ex: "1h", "24h", "2m") ou secondes
 * @returns messageId si succès, null si QStash non configuré ou erreur
 */
export async function scheduleReviewMessage(
  orderReviewRequestId: string,
  delay: QStashDelay | string,
): Promise<string | null> {
  const client = getQStashClient();
  if (!client) {
    console.warn("QStash: QSTASH_TOKEN non configuré, job non programmé");
    return null;
  }

  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    console.warn("QStash: BETTER_AUTH_URL ou VERCEL_URL manquant, job non programmé");
    return null;
  }

  const url = `${baseUrl}/api/send-review-message`;

  try {
    const res = await client.publishJSON({
      url,
      body: { orderReviewRequestId },
      delay: delay as QStashDelay & (number | `${bigint}s` | `${bigint}m` | `${bigint}h` | `${bigint}d`),
    });
    // publishJSON avec `url` renvoie PublishToUrlResponse (messageId); en urlGroup c'est un tableau
    const messageId = Array.isArray(res) ? res[0]?.messageId : (res as { messageId?: string }).messageId;
    return messageId ?? null;
  } catch (err) {
    const cause = err instanceof Error ? err.cause : undefined;
    const isRefused =
      cause instanceof Error &&
      "code" in cause &&
      (cause as NodeJS.ErrnoException).code === "ECONNREFUSED" &&
      String((cause as NodeJS.ErrnoException).address).startsWith("127.0.0.1");
    console.error("QStash schedule error:", err);
    if (isRefused) {
      console.warn(
        "QStash: local dev server not reachable. Start it with: npx @upstash/qstash-cli dev - or unset QSTASH_URL to use Upstash cloud.",
      );
    }
    return null;
  }
}

const REVIEW_SYNC_CATCHUP_SCHEDULE_ID = "reviews-sync-catchup";
const PLAN_BONUS_MONTHLY_SCHEDULE_ID = "plan-bonus-monthly";

/**
 * Creates the daily QStash schedule for the sync-catchup endpoint.
 * Call this once after deploy (e.g. from a setup script or on first run).
 * Catches accounts that weren't scheduled (e.g. migrated from Vercel Cron).
 */
export async function ensureReviewSyncCatchupSchedule(): Promise<boolean> {
  const client = getQStashClient();
  if (!client) return false;

  const baseUrl = getBaseUrl();
  if (!baseUrl) return false;

  const url = `${baseUrl}/api/reviews/sync-catchup`;

  try {
    await client.schedules.create({
      scheduleId: REVIEW_SYNC_CATCHUP_SCHEDULE_ID,
      destination: url,
      cron: "0 3 * * *", // Every day at 3 AM UTC
    });
    console.log("[QStash] Review sync catchup schedule created");
    return true;
  } catch (err) {
    console.error("QStash ensureReviewSyncCatchupSchedule error:", err);
    return false;
  }
}

/**
 * Creates the monthly QStash schedule for plan bonus (tokens granted to active subscribers).
 * Call once after deploy. Runs on the 1st of each month at 4 AM UTC.
 */
export async function ensurePlanBonusMonthlySchedule(): Promise<boolean> {
  const client = getQStashClient();
  if (!client) return false;

  const baseUrl = getBaseUrl();
  if (!baseUrl) return false;

  const url = `${baseUrl}/api/cron/plan-bonus-monthly`;

  try {
    await client.schedules.create({
      scheduleId: PLAN_BONUS_MONTHLY_SCHEDULE_ID,
      destination: url,
      cron: "0 4 1 * *", // 1st of each month at 4 AM UTC
    });
    console.log("[QStash] Plan bonus monthly schedule created");
    return true;
  } catch (err) {
    console.error("QStash ensurePlanBonusMonthlySchedule error:", err);
    return false;
  }
}
