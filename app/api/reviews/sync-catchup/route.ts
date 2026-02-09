import { startGoogleMapsScrape, startTrustpilotScrape } from "@/lib/apify";
import { prisma } from "@/lib/prisma";
import { REVIEWS_CONSTANTS } from "@/lib/reviews/constants";
import { NextRequest } from "next/server";
import { Receiver } from "@upstash/qstash";

/** Get set of userIds that have an active (paid) subscription. */
async function getPaidUserIds(): Promise<Set<string>> {
  const now = new Date();
  const subs = await prisma.subscription.findMany({
    where: {
      OR: [
        { status: { in: ["active", "trialing"] } },
        { cancelAtPeriodEnd: true, periodEnd: { gt: now } },
      ],
    },
    select: { referenceId: true },
  });
  return new Set(subs.map((s) => s.referenceId));
}

/**
 * POST /api/reviews/sync-catchup
 * Daily fallback: finds connected accounts that haven't synced in 7+ days
 * and starts a sync for each. Handles accounts migrated from Vercel Cron
 * or where the per-account QStash job failed.
 *
 * Called by QStash Schedule (daily at 3 AM UTC).
 */
export async function POST(request: NextRequest) {
  const currentKey = process.env.QSTASH_CURRENT_SIGNING_KEY;
  const nextKey = process.env.QSTASH_NEXT_SIGNING_KEY;

  if (!currentKey || !nextKey) {
    console.error("sync-catchup: QSTASH_CURRENT_SIGNING_KEY or QSTASH_NEXT_SIGNING_KEY missing");
    return Response.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const signature = request.headers.get("Upstash-Signature");
  if (!signature) {
    return Response.json({ error: "Missing Upstash-Signature" }, { status: 401 });
  }

  const rawBody = await request.text();
  const receiver = new Receiver({
    currentSigningKey: currentKey,
    nextSigningKey: nextKey,
  });

  const baseUrl =
    process.env.BETTER_AUTH_URL?.replace(/\/+$/, "") ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  const url = `${baseUrl}/api/reviews/sync-catchup`;

  const isValid = await receiver.verify({
    body: rawBody,
    signature,
    url,
  });

  if (!isValid) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  const cutoffDate = new Date(
    Date.now() - REVIEWS_CONSTANTS.AUTO_SYNC_INTERVAL_DAYS * 24 * 60 * 60 * 1000,
  );

  const [accountsToSync, paidUserIds] = await Promise.all([
    prisma.reviewAccount.findMany({
      where: {
        isConnected: true,
        OR: [{ lastSyncAt: { lt: cutoffDate } }, { lastSyncAt: null }],
      },
      include: {
        syncs: {
          where: { status: { in: ["PENDING", "RUNNING"] } },
          take: 1,
        },
      },
    }),
    getPaidUserIds(),
  ]);

  const eligibleAccounts = accountsToSync.filter(
    (account) =>
      account.syncs.length === 0 && paidUserIds.has(account.userId),
  );

  const results: Array<{
    accountId: string;
    source: string;
    status: "started" | "error";
    error?: string;
  }> = [];

  for (const account of eligibleAccounts) {
    try {
      if (account.source === "TRUSTPILOT") {
        if (!account.businessUrl) {
          results.push({
            accountId: account.id,
            source: "TRUSTPILOT",
            status: "error",
            error: "No business URL",
          });
          continue;
        }

        const newerThan = account.lastSyncAt ?? undefined;
        const apifyRun = await startTrustpilotScrape(account.businessUrl, {
          newerThan,
        });

        await prisma.reviewSync.create({
          data: {
            accountId: account.id,
            apifyRunId: apifyRun.data.id,
            apifyDatasetId: apifyRun.data.defaultDatasetId,
            status: "RUNNING",
          },
        });
      } else if (account.source === "GOOGLE") {
        const metadata = account.sourceMetadata as { placeIds?: string[] } | null;
        const placeIds = metadata?.placeIds ?? [account.sourceId];

        if (placeIds.length === 0) {
          results.push({
            accountId: account.id,
            source: "GOOGLE",
            status: "error",
            error: "No place IDs",
          });
          continue;
        }

        const reviewsStartDate = account.lastSyncAt
          ? account.lastSyncAt.toISOString().split("T")[0]
          : undefined;

        const apifyRun = await startGoogleMapsScrape(placeIds, {
          reviewsStartDate,
        });

        await prisma.reviewSync.create({
          data: {
            accountId: account.id,
            apifyRunId: apifyRun.data.id,
            apifyDatasetId: apifyRun.data.defaultDatasetId,
            status: "RUNNING",
          },
        });
      } else {
        results.push({
          accountId: account.id,
          source: account.source,
          status: "error",
          error: "Unknown source",
        });
        continue;
      }

      results.push({
        accountId: account.id,
        source: account.source,
        status: "started",
      });
    } catch (error) {
      console.error(`[sync-catchup] Error for account ${account.id}:`, error);
      results.push({
        accountId: account.id,
        source: account.source,
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return Response.json({
    ok: true,
    eligibleCount: eligibleAccounts.length,
    results,
    timestamp: new Date().toISOString(),
  });
}
