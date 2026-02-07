import { auth } from "@/auth";
import {
  type ApifyDatasetItem,
  deleteApifyDataset,
  getApifyDatasetItems,
  getApifyRunStatus,
} from "@/lib/apify";
import { prisma } from "@/lib/prisma";
import {
  createBatchChunks,
  parseReviewFromApify,
} from "@/lib/trustpilot/apify-mapper";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/trustpilot/status
 * Get the status of the current/latest sync
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get optional syncId from query params
    const { searchParams } = new URL(request.url);
    const syncId = searchParams.get("syncId");

    // Get Trustpilot account
    const account = await prisma.trustpilotAccount.findUnique({
      where: { userId: session.user.id },
    });

    if (!account) {
      return NextResponse.json(
        { error: "No Trustpilot account connected" },
        { status: 404 }
      );
    }

    // Get sync record
    const sync = syncId
      ? await prisma.trustpilotSync.findFirst({
          where: { id: syncId, accountId: account.id },
        })
      : await prisma.trustpilotSync.findFirst({
          where: { accountId: account.id },
          orderBy: { startedAt: "desc" },
        });

    if (!sync) {
      return NextResponse.json(
        { error: "No sync found" },
        { status: 404 }
      );
    }

    // If sync is still running, check Apify status
    if (
      sync.apifyRunId &&
      ["PENDING", "RUNNING"].includes(sync.status)
    ) {
      const apifyStatus = await getApifyRunStatus(sync.apifyRunId);
      const newStatus = apifyStatus.data.status;

      // If Apify job finished, process results
      if (newStatus === "SUCCEEDED" && sync.apifyDatasetId) {
        await processApifyResults(sync.id, sync.apifyDatasetId, account.id);

        return NextResponse.json({
          syncId: sync.id,
          status: "SUCCEEDED",
          finishedAt: apifyStatus.data.finishedAt,
        });
      }

      if (["FAILED", "ABORTED", "TIMED-OUT"].includes(newStatus)) {
        await prisma.trustpilotSync.update({
          where: { id: sync.id },
          data: {
            status: "FAILED",
            error: `Apify job ${newStatus.toLowerCase()}`,
            finishedAt: new Date(),
          },
        });

        return NextResponse.json({
          syncId: sync.id,
          status: "FAILED",
          error: `Apify job ${newStatus.toLowerCase()}`,
        });
      }

      // Still running
      return NextResponse.json({
        syncId: sync.id,
        status: "RUNNING",
        startedAt: sync.startedAt,
      });
    }

    // Return current sync status
    return NextResponse.json({
      syncId: sync.id,
      status: sync.status,
      error: sync.error,
      reviewsCount: sync.reviewsCount,
      startedAt: sync.startedAt,
      finishedAt: sync.finishedAt,
    });
  } catch (error) {
    console.error("Trustpilot status error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Process Apify results and store in database
 */
async function processApifyResults(
  syncId: string,
  datasetId: string,
  accountId: string
) {
  try {
    // Fetch results from Apify
    const items = await getApifyDatasetItems(datasetId);

    // Extract company info and stats from first item (if available)
    const firstItem = items[0] as ApifyDatasetItem | undefined;
    const company = firstItem?.company;
    const stats = firstItem?.stats;

    // Update account with company info and stats
    if (company || stats) {
      await prisma.trustpilotAccount.update({
        where: { id: accountId },
        data: {
          companyName: company?.displayName,
          trustScore: company?.trustScore,
          totalReviews: company?.numberOfReviews,
          profileImageUrl: company?.profileImageUrl,
          statsTotal: stats?.total,
          statsOne: stats?.one,
          statsTwo: stats?.two,
          statsThree: stats?.three,
          statsFour: stats?.four,
          statsFive: stats?.five,
          lastSyncAt: new Date(),
        },
      });
    }

    // Process reviews
    const reviews = items.filter(
      (item): item is ApifyDatasetItem & { id: string; rating: number } =>
        !!item.id && typeof item.rating === "number"
    );

    // Batch upsert reviews (parallel for performance)
    const chunks = createBatchChunks(reviews);
    let reviewsCount = 0;

    for (const chunk of chunks) {
      const upserts = chunk.map((review) => {
        const data = parseReviewFromApify(review);
        return prisma.trustpilotReview.upsert({
          where: {
            accountId_trustpilotId: {
              accountId,
              trustpilotId: review.id,
            },
          },
          create: {
            accountId,
            ...data,
            trustpilotId: review.id,
          },
          update: data,
        });
      });
      await Promise.all(upserts);
      reviewsCount += chunk.length;
    }

    // Update sync record
    await prisma.trustpilotSync.update({
      where: { id: syncId },
      data: {
        status: "SUCCEEDED",
        reviewsCount,
        finishedAt: new Date(),
      },
    });

    // Delete Apify dataset to save storage costs
    await deleteApifyDataset(datasetId);

    console.log(
      `[Trustpilot] Sync ${syncId} completed: ${reviewsCount} reviews processed`
    );
  } catch (error) {
    console.error("Error processing Apify results:", error);

    await prisma.trustpilotSync.update({
      where: { id: syncId },
      data: {
        status: "FAILED",
        error: error instanceof Error ? error.message : "Failed to process results",
        finishedAt: new Date(),
      },
    });

    throw error;
  }
}
