import { auth } from "@/auth";
import {
  deleteApifyDataset,
  getApifyDatasetItems,
  getApifyRunStatus,
} from "@/lib/apify";
import { prisma } from "@/lib/prisma";
import { scheduleNextReviewSync } from "@/lib/qstash";
import { REVIEWS_CONSTANTS } from "@/lib/reviews/constants";
import { getActivePlanForUser } from "@/lib/subscription";
import { createBatchChunks } from "@/lib/reviews/utils";
import {
  parseGoogleReviewFromApify,
  type GoogleReviewItem,
} from "@/lib/reviews/google/apify-mapper";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/reviews/google/status
 * Get the status of the current/latest sync
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const syncId = searchParams.get("syncId");

    const account = await prisma.reviewAccount.findUnique({
      where: {
        userId_source: { userId: session.user.id, source: "GOOGLE" },
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: "No Google Maps reviews account connected" },
        { status: 404 }
      );
    }

    const sync = syncId
      ? await prisma.reviewSync.findFirst({
          where: { id: syncId, accountId: account.id },
        })
      : await prisma.reviewSync.findFirst({
          where: { accountId: account.id },
          orderBy: { startedAt: "desc" },
        });

    if (!sync) {
      return NextResponse.json(
        { error: "No sync found" },
        { status: 404 }
      );
    }

    if (sync.apifyRunId && ["PENDING", "RUNNING"].includes(sync.status)) {
      const apifyStatus = await getApifyRunStatus(sync.apifyRunId);
      const newStatus = apifyStatus.data.status;

      if (newStatus === "SUCCEEDED" && sync.apifyDatasetId) {
        await processGoogleResults(sync.id, sync.apifyDatasetId, account.id);

        return NextResponse.json({
          syncId: sync.id,
          status: "SUCCEEDED",
          finishedAt: apifyStatus.data.finishedAt,
        });
      }

      if (["FAILED", "ABORTED", "TIMED-OUT"].includes(newStatus)) {
        await prisma.reviewSync.update({
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

      return NextResponse.json({
        syncId: sync.id,
        status: "RUNNING",
        startedAt: sync.startedAt,
      });
    }

    return NextResponse.json({
      syncId: sync.id,
      status: sync.status,
      error: sync.error,
      reviewsCount: sync.reviewsCount,
      startedAt: sync.startedAt,
      finishedAt: sync.finishedAt,
    });
  } catch (error) {
    console.error("Google reviews status error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

async function processGoogleResults(
  syncId: string,
  datasetId: string,
  accountId: string
) {
  try {
    const items = await getApifyDatasetItems(datasetId) as unknown[];
    const reviews = items.filter(
      (item): item is GoogleReviewItem =>
        !!item &&
        typeof item === "object" &&
        "reviewId" in item &&
        "stars" in item
    );

    // Compute distribution from reviews (Google doesn't provide it from API)
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const r of reviews) {
      const rating = Math.min(5, Math.max(1, r.stars));
      distribution[rating as 1 | 2 | 3 | 4 | 5]++;
    }

    const firstItem = reviews[0];
    await prisma.reviewAccount.update({
      where: { id: accountId },
      data: {
        ...(firstItem && {
          name: firstItem.title ?? null,
          trustScore: firstItem.totalScore ?? null,
          totalReviews: firstItem.reviewsCount ?? null,
          profileImageUrl: firstItem.imageUrl ?? null,
          businessUrl: firstItem.url ?? undefined,
        }),
        statsTotal: reviews.length,
        statsOne: distribution[1],
        statsTwo: distribution[2],
        statsThree: distribution[3],
        statsFour: distribution[4],
        statsFive: distribution[5],
        lastSyncAt: new Date(),
      },
    });

    const chunks = createBatchChunks(reviews);
    let reviewsCount = 0;

    for (const chunk of chunks) {
      const upserts = chunk.map((review) => {
        const data = parseGoogleReviewFromApify(review);
        return prisma.review.upsert({
          where: {
            accountId_sourceId: {
              accountId,
              sourceId: review.reviewId,
            },
          },
          create: {
            accountId,
            source: "GOOGLE",
            ...data,
          },
          update: data,
        });
      });
      await Promise.all(upserts);
      reviewsCount += chunk.length;
    }

    await prisma.reviewSync.update({
      where: { id: syncId },
      data: {
        status: "SUCCEEDED",
        reviewsCount,
        finishedAt: new Date(),
      },
    });

    await deleteApifyDataset(datasetId);

    // Schedule next periodic sync via QStash (7 days from now) - only for paid users
    const account = await prisma.reviewAccount.findUnique({
      where: { id: accountId },
      select: { userId: true },
    });
    if (account && (await getActivePlanForUser(account.userId)) !== "free") {
      await scheduleNextReviewSync(accountId, REVIEWS_CONSTANTS.AUTO_SYNC_QSTASH_DELAY);
    }

    console.log(
      `[Google] Sync ${syncId} completed: ${reviewsCount} reviews processed`
    );
  } catch (error) {
    console.error("Error processing Google results:", error);

    await prisma.reviewSync.update({
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
