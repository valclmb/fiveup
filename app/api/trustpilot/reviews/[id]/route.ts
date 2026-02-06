import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/trustpilot/reviews/[id]
 * Get a single Trustpilot review by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const account = await prisma.trustpilotAccount.findUnique({
      where: { userId: session.user.id },
    });

    if (!account) {
      return NextResponse.json(
        { error: "No Trustpilot account connected" },
        { status: 404 }
      );
    }

    const review = await prisma.trustpilotReview.findFirst({
      where: {
        id,
        accountId: account.id,
      },
      select: {
        id: true,
        trustpilotId: true,
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
      },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error("Trustpilot review detail error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
