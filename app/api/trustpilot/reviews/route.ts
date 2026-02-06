import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/trustpilot/reviews
 * Get stored Trustpilot reviews for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 100);
    const rating = searchParams.get("rating");
    const sortBy = searchParams.get("sortBy") ?? "publishedAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

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

    // Build filters
    const where: {
      accountId: string;
      rating?: number;
    } = {
      accountId: account.id,
    };

    if (rating) {
      const ratingNum = parseInt(rating, 10);
      if (ratingNum >= 1 && ratingNum <= 5) {
        where.rating = ratingNum;
      }
    }

    // Get total count
    const totalCount = await prisma.trustpilotReview.count({ where });

    // Get reviews with pagination
    const reviews = await prisma.trustpilotReview.findMany({
      where,
      orderBy: {
        [sortBy === "rating" ? "rating" : "publishedAt"]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Get rating distribution
    const ratingDistribution = await prisma.trustpilotReview.groupBy({
      by: ["rating"],
      where: { accountId: account.id },
      _count: { rating: true },
    });

    const stats = {
      total: totalCount,
      distribution: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      } as Record<number, number>,
    };

    for (const item of ratingDistribution) {
      stats.distribution[item.rating] = item._count.rating;
    }

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      stats,
    });
  } catch (error) {
    console.error("Trustpilot reviews error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
