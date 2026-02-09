import { startGoogleMapsScrape, startTrustpilotScrape } from "@/lib/apify";
import { prisma } from "@/lib/prisma";
import { userHasActiveSubscription } from "@/lib/subscription";
import { NextRequest } from "next/server";
import { Receiver } from "@upstash/qstash";

/**
 * POST /api/reviews/sync-scheduled
 * Called by QStash when a periodic review sync is due.
 * Each account is scheduled individually based on its last sync (7 days after completion).
 *
 * Body: { accountId: string }
 */
export async function POST(request: NextRequest) {
  const currentKey = process.env.QSTASH_CURRENT_SIGNING_KEY;
  const nextKey = process.env.QSTASH_NEXT_SIGNING_KEY;

  if (!currentKey || !nextKey) {
    console.error("sync-scheduled: QSTASH_CURRENT_SIGNING_KEY or QSTASH_NEXT_SIGNING_KEY missing");
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
  const url = `${baseUrl}/api/reviews/sync-scheduled`;

  const isValid = await receiver.verify({
    body: rawBody,
    signature,
    url,
  });

  if (!isValid) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: { accountId?: string };
  try {
    body = JSON.parse(rawBody) as { accountId?: string };
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const accountId = body.accountId;
  if (!accountId || typeof accountId !== "string") {
    return Response.json({ error: "Missing accountId" }, { status: 400 });
  }

  const account = await prisma.reviewAccount.findUnique({
    where: { id: accountId },
    include: {
      syncs: {
        where: { status: { in: ["PENDING", "RUNNING"] } },
        take: 1,
      },
    },
  });

  if (!account) {
    return Response.json({ error: "Account not found" }, { status: 404 });
  }

  if (!account.isConnected) {
    console.log(`[sync-scheduled] Account ${accountId} disconnected, skip`);
    return Response.json({ ok: true, skipped: true, reason: "Account disconnected" });
  }

  const hasSubscription = await userHasActiveSubscription(account.userId);
  if (!hasSubscription) {
    console.log(`[sync-scheduled] Account ${accountId} user has no active subscription (free), skip`);
    return Response.json({ ok: true, skipped: true, reason: "Free user - no subscription" });
  }

  if (account.syncs.length > 0) {
    console.log(`[sync-scheduled] Account ${accountId} already has sync in progress, skip`);
    return Response.json({ ok: true, skipped: true, reason: "Sync already running" });
  }

  try {
    if (account.source === "TRUSTPILOT") {
      if (!account.businessUrl) {
        return Response.json({ error: "Trustpilot account has no business URL" }, { status: 400 });
      }

      const newerThan = account.lastSyncAt ?? undefined;
      const apifyRun = await startTrustpilotScrape(account.businessUrl, { newerThan });

      await prisma.reviewSync.create({
        data: {
          accountId: account.id,
          apifyRunId: apifyRun.data.id,
          apifyDatasetId: apifyRun.data.defaultDatasetId,
          status: "RUNNING",
        },
      });

      console.log(
        `[sync-scheduled] Trustpilot sync started for account ${accountId} (domain: ${account.sourceId})`,
      );
    } else if (account.source === "GOOGLE") {
      const metadata = account.sourceMetadata as { placeIds?: string[] } | null;
      const placeIds = metadata?.placeIds ?? [account.sourceId];

      if (placeIds.length === 0) {
        return Response.json({ error: "No place IDs configured" }, { status: 400 });
      }

      const reviewsStartDate = account.lastSyncAt
        ? account.lastSyncAt.toISOString().split("T")[0]
        : undefined;

      const apifyRun = await startGoogleMapsScrape(placeIds, { reviewsStartDate });

      await prisma.reviewSync.create({
        data: {
          accountId: account.id,
          apifyRunId: apifyRun.data.id,
          apifyDatasetId: apifyRun.data.defaultDatasetId,
          status: "RUNNING",
        },
      });

      console.log(
        `[sync-scheduled] Google sync started for account ${accountId} (place: ${account.sourceId})`,
      );
    } else {
      return Response.json({ error: "Unknown source" }, { status: 400 });
    }

    return Response.json({ ok: true, source: account.source });
  } catch (error) {
    console.error(`[sync-scheduled] Error starting sync for account ${accountId}:`, error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Sync start failed" },
      { status: 500 },
    );
  }
}
