import { startTrustpilotScrape } from "@/lib/apify";
import { prisma } from "@/lib/prisma";
import { TRUSTPILOT_CONSTANTS } from "@/lib/reviews/trustpilot/constants";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/reviews/trustpilot/cron
 * Weekly cron job to sync all Trustpilot accounts
 *
 * Add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/reviews/trustpilot/cron",
 *     "schedule": "0 3 * * 0"  // Every Sunday at 3 AM UTC
 *   }]
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (for security)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find connected accounts that need sync
    const cutoffDate = new Date(
      Date.now() -
        TRUSTPILOT_CONSTANTS.AUTO_SYNC_INTERVAL_DAYS * 24 * 60 * 60 * 1000
    );

    const accountsToSync = await prisma.reviewAccount.findMany({
      where: {
        source: "TRUSTPILOT",
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

    // Filter out accounts with ongoing syncs
    const eligibleAccounts = accountsToSync.filter(
      (account) => account.syncs.length === 0
    );

    const results: Array<{
      accountId: string;
      domain: string;
      status: "started" | "skipped" | "error";
      error?: string;
    }> = [];

    for (const account of eligibleAccounts) {
      try {
        // Start incremental sync (only new reviews since last sync)
        const newerThan = account.lastSyncAt ?? undefined;

        const apifyRun = await startTrustpilotScrape(account.businessUrl!, {
          newerThan,
        });

        // Create sync record
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
          domain: account.sourceId,
          status: "started",
        });
      } catch (error) {
        console.error(`Failed to sync account ${account.id}:`, error);
        results.push({
          accountId: account.id,
          domain: account.sourceId,
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
    console.error("Trustpilot cron error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
