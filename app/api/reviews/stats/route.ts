import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

/**
 * GET /api/reviews/stats
 * Get stats for all connected review sources (Trustpilot + Google)
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accounts = await prisma.reviewAccount.findMany({
      where: {
        userId: session.user.id,
        isConnected: { not: false },
        source: { in: ["TRUSTPILOT", "GOOGLE"] },
      },
      select: {
        source: true,
        statsTotal: true,
        totalReviews: true,
        trustScore: true,
        statsOne: true,
        statsTwo: true,
        statsThree: true,
        statsFour: true,
        statsFive: true,
        lastSyncAt: true,
      },
    });

    const trustpilotAccount = accounts.find((a) => a.source === "TRUSTPILOT");
    const googleAccount = accounts.find((a) => a.source === "GOOGLE");

    const statsBySource: {
      trustpilot?: {
        total: number;
        trustScore: number | null;
        distribution: Record<number, number>;
        lastSyncAt: string | null;
      };
      google?: {
        total: number;
        trustScore: number | null;
        distribution: Record<number, number>;
        lastSyncAt: string | null;
      };
    } = {};

    if (trustpilotAccount) {
      statsBySource.trustpilot = {
        total: trustpilotAccount.statsTotal ?? 0,
        trustScore: trustpilotAccount.trustScore ?? null,
        lastSyncAt: trustpilotAccount.lastSyncAt?.toISOString() ?? null,
        distribution: {
          1: trustpilotAccount.statsOne ?? 0,
          2: trustpilotAccount.statsTwo ?? 0,
          3: trustpilotAccount.statsThree ?? 0,
          4: trustpilotAccount.statsFour ?? 0,
          5: trustpilotAccount.statsFive ?? 0,
        },
      };
    }

    if (googleAccount) {
      // Google: use totalReviews (reviewsCount from API) since statsTotal is not populated
      const total =
        googleAccount.statsTotal ?? googleAccount.totalReviews ?? 0;
      statsBySource.google = {
        total,
        trustScore: googleAccount.trustScore ?? null,
        lastSyncAt: googleAccount.lastSyncAt?.toISOString() ?? null,
        distribution: {
          1: googleAccount.statsOne ?? 0,
          2: googleAccount.statsTwo ?? 0,
          3: googleAccount.statsThree ?? 0,
          4: googleAccount.statsFour ?? 0,
          5: googleAccount.statsFive ?? 0,
        },
      };
    }

    return NextResponse.json({ statsBySource });
  } catch (error) {
    console.error("Reviews stats error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
