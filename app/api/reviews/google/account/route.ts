import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getCooldownStatus } from "@/lib/reviews/cooldown";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

/**
 * GET /api/reviews/google/account
 * Get the connected Google Maps reviews account info
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.reviewAccount.findUnique({
      where: {
        userId_source: { userId: session.user.id, source: "GOOGLE" },
      },
      include: {
        syncs: {
          orderBy: { startedAt: "desc" },
          take: 1,
        },
        _count: {
          select: { reviews: true },
        },
      },
    });

    if (!account) {
      return NextResponse.json({ connected: false, hasAccount: false });
    }

    const latestSync = account.syncs[0];
    const isConnected = account.isConnected !== false;

    const { canChange: canChangeDomain, daysUntilChange: daysUntilDomainChange } =
      getCooldownStatus(account.lastDomainChangeAt, account.createdAt);

    return NextResponse.json({
      connected: isConnected,
      hasAccount: true,
      account: {
        id: account.id,
        businessUrl: account.businessUrl,
        placeId: account.sourceId,
        companyName: account.name,
        trustScore: account.trustScore,
        totalReviews: account.totalReviews,
        profileImageUrl: account.profileImageUrl,
        lastSyncAt: account.lastSyncAt,
        reviewsStored: account._count.reviews,
        canChangeDomain,
        daysUntilDomainChange,
        stats: {
          total: account.statsTotal,
          one: account.statsOne,
          two: account.statsTwo,
          three: account.statsThree,
          four: account.statsFour,
          five: account.statsFive,
        },
      },
      latestSync: latestSync
        ? {
            id: latestSync.id,
            status: latestSync.status,
            reviewsCount: latestSync.reviewsCount,
            startedAt: latestSync.startedAt,
            finishedAt: latestSync.finishedAt,
            error: latestSync.error,
          }
        : null,
    });
  } catch (error) {
    console.error("Google reviews account error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/reviews/google/account
 * Disconnect the Google Maps reviews account
 */
export async function DELETE() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    if (account.isConnected === false) {
      return NextResponse.json(
        { error: "Account is already disconnected" },
        { status: 400 }
      );
    }

    await prisma.reviewAccount.update({
      where: { id: account.id },
      data: { isConnected: false },
    });

    return NextResponse.json({
      success: true,
      message: "Google Maps reviews disconnected. Your reviews are preserved.",
    });
  } catch (error) {
    console.error("Google reviews disconnect error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
