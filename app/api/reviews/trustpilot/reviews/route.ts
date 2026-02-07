import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/reviews/trustpilot/reviews
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
    const status = searchParams.get("status"); // "answered" | "pending"
    const countryParam = searchParams.get("country"); // ISO codes: single "FR" or comma-separated "FR,GB,US"
    const search = searchParams.get("search")?.trim();
    const sortByParam = searchParams.get("sortBy");
    const sortBy =
      sortByParam === "rating" || sortByParam === "publishedAt"
        ? sortByParam
        : "publishedAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

    // Get Trustpilot review account
    const account = await prisma.reviewAccount.findUnique({
      where: {
        userId_source: { userId: session.user.id, source: "TRUSTPILOT" },
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: "No Trustpilot account connected" },
        { status: 404 }
      );
    }

    // Build filters
    type ReviewWhere = {
      accountId: string;
      rating?: number;
      authorCountry?: string | { in: string[] };
      replyText?: { not: null } | null;
      OR?: Array<
        | { text?: { contains: string; mode: "insensitive" } }
        | { title?: { contains: string; mode: "insensitive" } }
        | { authorName?: { contains: string; mode: "insensitive" } }
      >;
    };

    const where: ReviewWhere = {
      accountId: account.id,
    };

    if (rating) {
      const ratingNum = parseInt(rating, 10);
      if (ratingNum >= 1 && ratingNum <= 5) {
        where.rating = ratingNum;
      }
    }

    if (status === "answered") {
      where.replyText = { not: null };
    } else if (status === "pending") {
      where.replyText = null;
    }

    if (countryParam) {
      const countries = countryParam
        .split(",")
        .map((c) => c.trim().toUpperCase())
        .filter((c) => c.length === 2);
      if (countries.length === 1) {
        where.authorCountry = countries[0];
      } else if (countries.length > 1) {
        where.authorCountry = { in: countries };
      }
    }

    if (search) {
      where.OR = [
        { text: { contains: search, mode: "insensitive" } },
        { title: { contains: search, mode: "insensitive" } },
        { authorName: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get total count and distinct countries for filter
    const [totalCount, countriesRaw] = await Promise.all([
      prisma.review.count({ where }),
      prisma.review.findMany({
        where: { accountId: account.id },
        select: { authorCountry: true },
        distinct: ["authorCountry"],
        orderBy: { authorCountry: "asc" },
      }),
    ]);
    const countries = countriesRaw
      .map((c) => c.authorCountry)
      .filter((c): c is string => !!c);

    // Get reviews with pagination
    const reviewsRaw = await prisma.review.findMany({
      where,
      select: {
        id: true,
        sourceId: true,
        rating: true,
        title: true,
        text: true,
        language: true,
        authorName: true,
        authorImageUrl: true,
        authorCountry: true,
        isVerified: true,
        experiencedAt: true,
        publishedAt: true,
        replyText: true,
        replyPublishedAt: true,
        reviewUrl: true,
      },
      orderBy: {
        [sortBy === "rating" ? "rating" : "publishedAt"]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const reviews = reviewsRaw.map((r) => ({
      ...r,
      trustpilotId: r.sourceId, // Backward compat for frontend
      reviewUrl: r.reviewUrl ?? `https://www.trustpilot.com/reviews/${r.sourceId}`,
    }));

    // Use stored stats from Trustpilot (synced via Apify with includeStatistics: true)
    const stats = {
      total: account.statsTotal ?? 0,
      trustScore: account.trustScore ?? null,
      distribution: {
        1: account.statsOne ?? 0,
        2: account.statsTwo ?? 0,
        3: account.statsThree ?? 0,
        4: account.statsFour ?? 0,
        5: account.statsFive ?? 0,
      } as Record<number, number>,
    };

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      stats,
      countries,
    });
  } catch (error) {
    console.error("Trustpilot reviews error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
