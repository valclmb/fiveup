import { auth } from "@/auth";
import { startGoogleMapsScrape } from "@/lib/apify";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const connectSchema = z.object({
  placeIds: z.array(z.string().min(1)).min(1, "At least one place ID is required"),
});

/** Extract placeId from Google Maps URL if needed */
function extractPlaceId(input: string): string | null {
  const placeIdMatch = input.match(/place_id[=:]([A-Za-z0-9_-]+)/i);
  if (placeIdMatch) return placeIdMatch[1];
  // Assume it's a raw placeId if it looks like one (ChIJ...)
  if (input.startsWith("ChIJ") && input.length > 20) return input;
  return null;
}

/**
 * POST /api/reviews/google/connect
 * Connect a Google Maps place and start syncing reviews
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

    const placeIds = parsed.data.placeIds
      .map((p) => extractPlaceId(p.trim()) ?? p.trim())
      .filter(Boolean);

    if (placeIds.length === 0) {
      return NextResponse.json(
        { error: "No valid place IDs. Use format ChIJ... or a Google Maps URL with place_id." },
        { status: 400 }
      );
    }

    const primaryPlaceId = placeIds[0];
    const businessUrl = `https://www.google.com/maps/search/?api=1&query=place_id:${primaryPlaceId}`;

    // Check if account already exists
    const existingAccount = await prisma.reviewAccount.findUnique({
      where: { userId_source: { userId: session.user.id, source: "GOOGLE" } },
      include: {
        syncs: { orderBy: { startedAt: "desc" }, take: 1 },
        _count: { select: { reviews: true } },
      },
    });

    const isCurrentlyConnected = existingAccount?.isConnected !== false;

    // Case 1: Account exists and is connected
    if (existingAccount && isCurrentlyConnected) {
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
        { error: "Google Maps reviews are already connected. Disconnect first to change place." },
        { status: 400 }
      );
    }

    // Case 2: Account exists but disconnected
    if (existingAccount && !isCurrentlyConnected) {
      const isSamePlace = existingAccount.sourceId === primaryPlaceId;

      if (isSamePlace) {
        await prisma.reviewAccount.update({
          where: { id: existingAccount.id },
          data: { isConnected: true },
        });
        return NextResponse.json({
          success: true,
          accountId: existingAccount.id,
          status: "RECONNECTED",
          message: "Account reconnected. Your reviews are still available.",
          reviewsCount: existingAccount._count.reviews,
        });
      }

      // Different place - delete old reviews and reconnect
      await prisma.review.deleteMany({
        where: { accountId: existingAccount.id },
      });

      await prisma.reviewAccount.update({
        where: { id: existingAccount.id },
        data: {
          sourceId: primaryPlaceId,
          businessUrl,
          isConnected: true,
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
          sourceMetadata: { placeIds },
        },
      });

      const apifyRun = await startGoogleMapsScrape(placeIds);
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
        message: "Place changed. Sync started.",
      });
    }

    // Case 3: No existing account - create new
    const account = await prisma.reviewAccount.create({
      data: {
        userId: session.user.id,
        source: "GOOGLE",
        sourceId: primaryPlaceId,
        businessUrl,
        isConnected: true,
        sourceMetadata: { placeIds },
      },
    });

    const apifyRun = await startGoogleMapsScrape(placeIds);
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
    console.error("Google reviews connect error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
