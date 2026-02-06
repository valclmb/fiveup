import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

/**
 * GET /api/trustpilot/account
 * Get the connected Trustpilot account info
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.trustpilotAccount.findUnique({
      where: { userId: session.user.id },
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

    // isConnected: true or null = connected, false = disconnected
    const isConnected = account.isConnected !== false;

    // Calculate days until domain can be changed
    const DOMAIN_CHANGE_COOLDOWN_DAYS = 30;
    const lastDomainChange = account.lastDomainChangeAt ?? account.createdAt;
    const daysSinceLastDomainChange = Math.floor(
      (Date.now() - lastDomainChange.getTime()) / (1000 * 60 * 60 * 24)
    );
    const canChangeDomain = daysSinceLastDomainChange >= DOMAIN_CHANGE_COOLDOWN_DAYS;
    const daysUntilDomainChange = canChangeDomain
      ? 0
      : DOMAIN_CHANGE_COOLDOWN_DAYS - daysSinceLastDomainChange;

    return NextResponse.json({
      connected: isConnected,
      hasAccount: true,
      account: {
        id: account.id,
        businessUrl: account.businessUrl,
        businessDomain: account.businessDomain,
        companyName: account.companyName,
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
    console.error("Trustpilot account error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/trustpilot/account
 * Disconnect the Trustpilot account (keeps data for potential reconnection)
 */
export async function DELETE() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.trustpilotAccount.findUnique({
      where: { userId: session.user.id },
    });

    if (!account) {
      return NextResponse.json(
        { error: "No Trustpilot account connected" },
        { status: 404 }
      );
    }

    // isConnected: true or null = connected, false = already disconnected
    if (account.isConnected === false) {
      return NextResponse.json(
        { error: "Account is already disconnected" },
        { status: 400 }
      );
    }

    // Mark as disconnected (keep data for potential reconnection)
    await prisma.trustpilotAccount.update({
      where: { id: account.id },
      data: { isConnected: false },
    });

    return NextResponse.json({
      success: true,
      message: "Trustpilot account disconnected. Your reviews are preserved.",
    });
  } catch (error) {
    console.error("Trustpilot disconnect error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
