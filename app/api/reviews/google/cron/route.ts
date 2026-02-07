import { startGoogleMapsScrape } from "@/lib/apify";
import { prisma } from "@/lib/prisma";
import { GOOGLE_CONSTANTS } from "@/lib/reviews/google/constants";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/reviews/google/cron
 * Weekly cron job to sync all Google Maps reviews accounts
 *
 * Add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/reviews/google/cron",
 *     "schedule": "0 4 * * 0"  // Every Sunday at 4 AM UTC (after Trustpilot)
 *   }]
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cutoffDate = new Date(
      Date.now() -
        GOOGLE_CONSTANTS.AUTO_SYNC_INTERVAL_DAYS * 24 * 60 * 60 * 1000
    );

    const accountsToSync = await prisma.reviewAccount.findMany({
      where: {
        source: "GOOGLE",
        NOT: { isConnected: false },
        OR: [
          { lastSyncAt: { lt: cutoffDate } },
          { lastSyncAt: null },
        ],
      },
      include: {
        syncs: {
          where: { status: { in: ["PENDING", "RUNNING"] } },
          take: 1,
        },
      },
    });

    const eligibleAccounts = accountsToSync.filter(
      (account) => account.syncs.length === 0
    );

    const results: Array<{
      accountId: string;
      placeId: string;
      status: "started" | "skipped" | "error";
      error?: string;
    }> = [];

    for (const account of eligibleAccounts) {
      try {
        const metadata = account.sourceMetadata as { placeIds?: string[] } | null;
        const placeIds = metadata?.placeIds ?? [account.sourceId];

        if (placeIds.length === 0) {
          results.push({
            accountId: account.id,
            placeId: account.sourceId,
            status: "error",
            error: "No place IDs configured",
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

        results.push({
          accountId: account.id,
          placeId: account.sourceId,
          status: "started",
        });
      } catch (error) {
        console.error(`Failed to sync Google account ${account.id}:`, error);
        results.push({
          accountId: account.id,
          placeId: account.sourceId,
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      success: true,
      totalAccounts: accountsToSync.length,
      eligibleAccounts: eligibleAccounts.length,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Google reviews cron error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
