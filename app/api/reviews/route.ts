import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/reviews
 * Get all reviews for the current user (Trustpilot + Google)
 * Query params: page, limit, source (trustpilot|google), rating, status, country, search, sortBy, sortOrder
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
    const sourceParam = searchParams.get("source"); // "trustpilot" | "google"
    const rating = searchParams.get("rating");
    const status = searchParams.get("status");
    const countryParam = searchParams.get("country");
    const search = searchParams.get("search")?.trim();
    const sortByParam = searchParams.get("sortBy");
    const sortBy =
      sortByParam === "rating" || sortByParam === "publishedAt"
        ? sortByParam
        : "publishedAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

    // Get connected accounts
    const accountsWhere: { userId: string; isConnected?: object } = {
      userId: session.user.id,
    };
    accountsWhere.isConnected = { not: false };

    const accounts = await prisma.reviewAccount.findMany({
      where: accountsWhere,
      select: { id: true, source: true },
    });

    if (accounts.length === 0) {
      return NextResponse.json(
        { error: "No review account connected" },
        { status: 404 }
      );
    }

    // Filter by source if specified
    let accountIds = accounts.map((a) => a.id);
    if (sourceParam === "trustpilot") {
      accountIds = accounts
        .filter((a) => a.source === "TRUSTPILOT")
        .map((a) => a.id);
    } else if (sourceParam === "google") {
      accountIds = accounts
        .filter((a) => a.source === "GOOGLE")
        .map((a) => a.id);
    }

    if (accountIds.length === 0) {
      return NextResponse.json(
        { error: `No ${sourceParam} account connected` },
        { status: 404 }
      );
    }

    type ReviewWhere = {
      accountId: { in: string[] };
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
      accountId: { in: accountIds },
    };

    if (rating) {
      const ratingNum = parseInt(rating, 10);
      if (ratingNum >= 1 && ratingNum <= 5) where.rating = ratingNum;
    }
    if (status === "answered") where.replyText = { not: null };
    else if (status === "pending") where.replyText = null;

    if (countryParam) {
      const countries = countryParam
        .split(",")
        .map((c) => c.trim().toUpperCase())
        .filter((c) => c.length === 2);
      if (countries.length === 1) where.authorCountry = countries[0];
      else if (countries.length > 1) where.authorCountry = { in: countries };
    }

    if (search) {
      where.OR = [
        { text: { contains: search, mode: "insensitive" } },
        { title: { contains: search, mode: "insensitive" } },
        { authorName: { contains: search, mode: "insensitive" } },
      ];
    }

    const [totalCount, countriesRaw, reviewsRaw] = await Promise.all([
      prisma.review.count({ where }),
      prisma.review.findMany({
        where: { accountId: { in: accountIds } },
        select: { authorCountry: true },
        distinct: ["authorCountry"],
        orderBy: { authorCountry: "asc" },
      }),
      prisma.review.findMany({
        where,
        select: {
          id: true,
          source: true,
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
      }),
    ]);

    const countries = countriesRaw
      .map((c) => c.authorCountry)
      .filter((c): c is string => !!c);

    const reviews = reviewsRaw.map((r) => ({
      ...r,
      source: r.source as "TRUSTPILOT" | "GOOGLE",
      trustpilotId: r.sourceId,
      reviewUrl:
        r.reviewUrl ??
        (r.source === "TRUSTPILOT"
          ? `https://www.trustpilot.com/reviews/${r.sourceId}`
          : null),
    }));

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      countries,
    });
  } catch (error) {
    console.error("Reviews error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
