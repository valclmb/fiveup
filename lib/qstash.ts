import { Client } from "@upstash/qstash";

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
    console.error("QStash schedule error:", err);
    return null;
  }
}
