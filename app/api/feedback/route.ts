// app/api/feedback/route.ts
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { FEEDBACK_CONSTANTS, FEEDBACK_ERRORS } from "@/lib/feedback";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface FeedbackBody {
  message?: string;
  pageUrl?: string;
}

async function validateSession() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return { error: NextResponse.json({ error: FEEDBACK_ERRORS.UNAUTHORIZED }, { status: 401 }) };
  }

  return { userId: session.user.id };
}

function validateInput(body: FeedbackBody) {
  const message = body.message?.trim() || "";
  const pageUrl = body.pageUrl?.trim() || "";

  if (!message) {
    return { error: NextResponse.json({ error: FEEDBACK_ERRORS.MESSAGE_REQUIRED }, { status: 400 }) };
  }

  if (message.length > FEEDBACK_CONSTANTS.MAX_MESSAGE_LENGTH) {
    return { error: NextResponse.json({ error: FEEDBACK_ERRORS.MESSAGE_TOO_LONG }, { status: 400 }) };
  }

  if (!pageUrl) {
    return { error: NextResponse.json({ error: FEEDBACK_ERRORS.PAGE_URL_REQUIRED }, { status: 400 }) };
  }

  if (pageUrl.length > FEEDBACK_CONSTANTS.MAX_PAGE_URL_LENGTH) {
    return { error: NextResponse.json({ error: FEEDBACK_ERRORS.PAGE_URL_TOO_LONG }, { status: 400 }) };
  }

  return { message, pageUrl };
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

  // 2. Parser le body
  let body: FeedbackBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: FEEDBACK_ERRORS.INVALID_JSON }, { status: 400 });
  }

  // 3. Valider l'input
  const validationResult = validateInput(body);
  if ("error" in validationResult) return validationResult.error;
  const { message, pageUrl } = validationResult;

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