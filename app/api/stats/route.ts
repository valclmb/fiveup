import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const MONTH_LABELS = [
  "Jan", "Fev", "Mar", "Avr", "Mai", "Jui",
  "Jul", "Aou", "Sep", "Oct", "Nov", "Dec",
];

/**
 * GET /api/stats
 * Returns monthly review counts for the chart + 5 most recent reviews
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
        id: true,
        source: true,
        statsTotal: true,
        totalReviews: true,
        trustScore: true,
        statsOne: true,
        statsTwo: true,
        statsThree: true,
        statsFour: true,
        statsFive: true,
      },
    });
    const accountIds = accounts.map((a) => a.id);

    if (accountIds.length === 0) {
      return NextResponse.json({
        data: generateEmptyMonthlyData(),
        recentReviews: [],
        statsBySource: {},
      });
    }

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 11);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const [monthlyReviews, recentReviewsRaw] = await Promise.all([
      prisma.review.findMany({
        where: {
          accountId: { in: accountIds },
          OR: [
            { publishedAt: { gte: startDate } },
            { publishedAt: null, createdAt: { gte: startDate } },
          ],
        },
        select: { publishedAt: true, createdAt: true, source: true },
      }),
      prisma.review.findMany({
        where: { accountId: { in: accountIds } },
        select: {
          id: true,
          authorName: true,
          authorImageUrl: true,
          rating: true,
          source: true,
          sourceId: true,
          publishedAt: true,
          createdAt: true,
        },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        take: 20,
      }),
    ]);

    const monthMap = new Map<string, { total: number; trustpilot: number; google: number }>();
    for (const r of monthlyReviews) {
      const date = r.publishedAt ?? r.createdAt;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const entry = monthMap.get(key) ?? { total: 0, trustpilot: 0, google: 0 };
      entry.total += 1;
      if (r.source === "TRUSTPILOT") entry.trustpilot += 1;
      else if (r.source === "GOOGLE") entry.google += 1;
      monthMap.set(key, entry);
    }

    const sortedRecent = recentReviewsRaw
      .sort((a, b) => {
        const da = a.publishedAt ?? a.createdAt;
        const db = b.publishedAt ?? b.createdAt;
        return db.getTime() - da.getTime();
      })
      .slice(0, 5);
    const recentReviews = sortedRecent.map((r) => ({
      id: r.id,
      authorName: r.authorName ?? "Anonymous",
      authorImageUrl: r.authorImageUrl ?? null,
      rating: r.rating,
      source: r.source as "TRUSTPILOT" | "GOOGLE",
      reviewUrl: r.source === "TRUSTPILOT" ? `https://www.trustpilot.com/reviews/${r.sourceId}` : null,
    }));

    const statsBySource = buildStatsBySource(accounts);
    const data = buildMonthlyData(monthMap);
    return NextResponse.json({ data, recentReviews, statsBySource });
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

function buildStatsBySource(
  accounts: Array<{
    source: string;
    statsTotal: number | null;
    totalReviews: number | null;
    trustScore: number | null;
    statsOne: number | null;
    statsTwo: number | null;
    statsThree: number | null;
    statsFour: number | null;
    statsFive: number | null;
  }>
) {
  const result: Record<
    string,
    { total: number; trustScore: number | null; distribution: Record<number, number> }
  > = {};
  for (const a of accounts) {
    const total = a.source === "GOOGLE"
      ? (a.statsTotal ?? a.totalReviews ?? 0)
      : (a.statsTotal ?? 0);
    result[a.source] = {
      total,
      trustScore: a.trustScore ?? null,
      distribution: {
        1: a.statsOne ?? 0,
        2: a.statsTwo ?? 0,
        3: a.statsThree ?? 0,
        4: a.statsFour ?? 0,
        5: a.statsFive ?? 0,
      },
    };
  }
  return result;
}

function formatMonthYear(d: Date) {
  return `${MONTH_LABELS[d.getMonth()]} ${d.getFullYear()}`;
}

function generateEmptyMonthlyData() {
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    return {
      month: formatMonthYear(d),
      avis: 0,
      fullMonth: d.toISOString().slice(0, 7),
      bySource: { trustpilot: 0, google: 0 },
    };
  });
}

function buildMonthlyData(monthMap: Map<string, { total: number; trustpilot: number; google: number }>) {
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const entry = monthMap.get(key) ?? { total: 0, trustpilot: 0, google: 0 };
    return {
      month: formatMonthYear(d),
      avis: entry.total,
      fullMonth: key,
      bySource: { trustpilot: entry.trustpilot, google: entry.google },
    };
  });
}
