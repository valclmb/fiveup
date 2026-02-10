// app/api/feedback/route.ts
import { auth } from "@/auth";
import { feedbackPostSchema } from "@/lib/schemas";
import { prisma } from "@/lib/prisma";
import { FEEDBACK_CONSTANTS, FEEDBACK_ERRORS } from "@/lib/feedback";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function validateSession() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return { error: NextResponse.json({ error: FEEDBACK_ERRORS.UNAUTHORIZED }, { status: 401 }) };
  }

  return { userId: session.user.id };
}

async function checkRateLimit(userId: string) {
  const count = await prisma.feedback.count({
    where: { userId },
  });

  if (count >= FEEDBACK_CONSTANTS.MAX_FEEDBACK_PER_USER) {
    return { error: NextResponse.json({ error: FEEDBACK_ERRORS.RATE_LIMIT }, { status: 429 }) };
  }

  return { ok: true };
}

export async function POST(request: NextRequest) {
  // 1. Valider la session
  const sessionResult = await validateSession();
  if ("error" in sessionResult) return sessionResult.error;
  const { userId } = sessionResult;

  // 2. Parse and validate body (strict server-side validation)
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: FEEDBACK_ERRORS.INVALID_JSON }, { status: 400 });
  }

  const parsed = feedbackPostSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request data", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { message, pageUrl } = parsed.data;

  // 4. Vérifier le rate limit
  const rateLimitResult = await checkRateLimit(userId);
  if ("error" in rateLimitResult) return rateLimitResult.error;

  // 5. Créer le feedback
  try {
    await prisma.feedback.create({
      data: {
        userId,
        pageUrl,
        message,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Feedback creation error:", err);
    return NextResponse.json({ error: FEEDBACK_ERRORS.SAVE_FAILED }, { status: 500 });
  }
}