import { auth } from "@/auth";
import {
  extractDomainFromUrl,
  normalizeTrustpilotUrl,
  startTrustpilotScrape,
} from "@/lib/apify";
import { prisma } from "@/lib/prisma";
import { TRUSTPILOT_CONSTANTS } from "@/lib/reviews/trustpilot/constants";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const connectSchema = z.object({
  url: z.string().min(1, "URL is required"),
});

/**
 * POST /api/reviews/trustpilot/connect
 * Connect a Trustpilot account and start syncing reviews
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = connectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { url } = parsed.data;
    const businessUrl = normalizeTrustpilotUrl(url);
    const businessDomain = extractDomainFromUrl(url);

    // Check if account already exists
    const existingAccount = await prisma.reviewAccount.findUnique({
      where: { userId_source: { userId: session.user.id, source: "TRUSTPILOT" } },
      include: {
        syncs: { orderBy: { startedAt: "desc" }, take: 1 },
        _count: { select: { reviews: true } },
      },
    });

    // isConnected: true or null = connected, false = disconnected
    const isCurrentlyConnected = existingAccount?.isConnected !== false;

    // Case 1: Account exists and is connected
    if (existingAccount && isCurrentlyConnected) {
      // Check if sync is already running
      const latestSync = existingAccount.syncs[0];
      if (latestSync && ["PENDING", "RUNNING"].includes(latestSync.status)) {
        return NextResponse.json(
          {
            error: "A sync is already in progress",
            syncId: latestSync.id,
            status: latestSync.status,
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Trustpilot account is already connected. Disconnect first to change domain." },
        { status: 400 }
      );
    }

    // Case 2: Account exists but is disconnected
    if (existingAccount && !isCurrentlyConnected) {
      const isSameDomain = existingAccount.sourceId === businessDomain;

      if (isSameDomain) {
        // Reconnect same domain - just reactivate, no new sync needed
        await prisma.reviewAccount.update({
          where: { id: existingAccount.id },
          data: { isConnected: true },
        });

        return NextResponse.json({
          success: true,
          accountId: existingAccount.id,
          status: "RECONNECTED",
          message: "Account reconnected successfully. Your reviews are still available.",
          reviewsCount: existingAccount._count.reviews,
        });
      }

      // Different domain - check cooldown
      const lastChange = existingAccount.lastDomainChangeAt ?? existingAccount.createdAt;
      const daysSinceLastChange = Math.floor(
        (Date.now() - lastChange.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceLastChange < TRUSTPILOT_CONSTANTS.DOMAIN_CHANGE_COOLDOWN_DAYS) {
        const daysRemaining =
          TRUSTPILOT_CONSTANTS.DOMAIN_CHANGE_COOLDOWN_DAYS - daysSinceLastChange;
        return NextResponse.json(
          {
            error: `Domain change not allowed. Wait ${daysRemaining} day(s) or reconnect "${existingAccount.sourceId}".`,
            daysRemaining,
            currentDomain: existingAccount.sourceId,
          },
          { status: 429 }
        );
      }

      // Domain change allowed - delete old reviews
      await prisma.review.deleteMany({
        where: { accountId: existingAccount.id },
      });

      // Update account with new domain
      await prisma.reviewAccount.update({
        where: { id: existingAccount.id },
        data: {
          businessUrl,
          sourceId: businessDomain,
          isConnected: true,
          lastDomainChangeAt: new Date(),
          name: null,
          trustScore: null,
          totalReviews: null,
          profileImageUrl: null,
          statsTotal: null,
          statsOne: null,
          statsTwo: null,
          statsThree: null,
          statsFour: null,
          statsFive: null,
        },
      });

      // Start Apify scrape (full sync for new domain)
      const apifyRun = await startTrustpilotScrape(businessUrl);

      const sync = await prisma.reviewSync.create({
        data: {
          accountId: existingAccount.id,
          apifyRunId: apifyRun.data.id,
          apifyDatasetId: apifyRun.data.defaultDatasetId,
          status: "RUNNING",
        },
      });

      return NextResponse.json({
        success: true,
        accountId: existingAccount.id,
        syncId: sync.id,
        status: "RUNNING",
        message: "Domain changed. Full sync started.",
      });
    }

    // Case 3: No existing account - create new
    const account = await prisma.reviewAccount.create({
      data: {
        userId: session.user.id,
        source: "TRUSTPILOT",
        sourceId: businessDomain,
        businessUrl,
        isConnected: true,
        lastDomainChangeAt: new Date(),
      },
    });

    // Start Apify scrape (full sync)
    const apifyRun = await startTrustpilotScrape(businessUrl);

    const sync = await prisma.reviewSync.create({
      data: {
        accountId: account.id,
        apifyRunId: apifyRun.data.id,
        apifyDatasetId: apifyRun.data.defaultDatasetId,
        status: "RUNNING",
      },
    });

    return NextResponse.json({
      success: true,
      accountId: account.id,
      syncId: sync.id,
      status: "RUNNING",
      message: "Sync started successfully",
    });
  } catch (error) {
    console.error("Trustpilot connect error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
