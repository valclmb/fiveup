import { auth } from "@/auth";
import { requireProPlanForWrite } from "@/lib/require-pro-plan";
import { feedbackPagePatchSchema } from "@/lib/schemas";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const togglable = (content: string | null, enabled: boolean | null) => ({
  enabled: enabled ?? true,
  content: content ?? "",
});

const DEFAULT_SUBJECTS = [
  "Product quality",
  "Delivery",
  "Customer service",
  "Overall experience",
  "Other",
] as const;

const DEFAULTS = {
  title: "How would you rate your experience?",
  helpText: togglable("Share your experience to help us improve.", true),
  reviewTag: togglable("What is the main subject of your feedback?", true),
  reviewTagOptions: [...DEFAULT_SUBJECTS],
  reviewTitle: togglable("Give a title to your review", true),
  reviewComment: togglable("Leave a comment", true),
} as const;

const MAX_SUBJECTS = 5;

function parseTagOptions(v: unknown): string[] {
  if (!Array.isArray(v)) return [...DEFAULT_SUBJECTS];
  return v.filter((x): x is string => typeof x === "string").slice(0, MAX_SUBJECTS);
}

function mapRow(row: {
  title: string | null;
  helpText: string | null;
  helpTextEnabled: boolean | null;
  reviewTag: string | null;
  reviewTagEnabled: boolean | null;
  reviewTagOptions?: unknown;
  reviewTitle: string | null;
  reviewTitleEnabled: boolean | null;
  reviewComment: string | null;
  reviewCommentEnabled: boolean | null;
}) {
  return {
    title: row.title ?? DEFAULTS.title,
    helpText: togglable(row.helpText, row.helpTextEnabled ?? true),
    reviewTag: togglable(row.reviewTag, row.reviewTagEnabled ?? true),
    reviewTagOptions: parseTagOptions(row.reviewTagOptions),
    reviewTitle: togglable(row.reviewTitle, row.reviewTitleEnabled ?? true),
    reviewComment: togglable(row.reviewComment, row.reviewCommentEnabled ?? true),
  };
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const row = await prisma.feedbackPageCustomization.findUnique({
    where: { userId: session.user.id },
  });

  if (!row) {
    return NextResponse.json({
      title: DEFAULTS.title,
      helpText: DEFAULTS.helpText,
      reviewTag: DEFAULTS.reviewTag,
      reviewTagOptions: DEFAULTS.reviewTagOptions,
      reviewTitle: DEFAULTS.reviewTitle,
      reviewComment: DEFAULTS.reviewComment,
    });
  }

  return NextResponse.json(mapRow(row));
}

export async function PATCH(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }
  const forbidden = requireProPlanForWrite(session);
  if (forbidden) return forbidden;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = feedbackPagePatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request data", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const d = parsed.data;
  const data: Parameters<typeof prisma.feedbackPageCustomization.upsert>[0]["create"] = {
    userId: session.user.id,
  };
  if (d.title !== undefined) data.title = d.title;
  if (d.helpText !== undefined) {
    data.helpText = d.helpText.content;
    data.helpTextEnabled = d.helpText.enabled;
  }
  if (d.reviewTag !== undefined) {
    data.reviewTag = d.reviewTag.content;
    data.reviewTagEnabled = d.reviewTag.enabled;
  }
  if (d.reviewTagOptions !== undefined) data.reviewTagOptions = d.reviewTagOptions;
  if (d.reviewTitle !== undefined) {
    data.reviewTitle = d.reviewTitle.content;
    data.reviewTitleEnabled = d.reviewTitle.enabled;
  }
  if (d.reviewComment !== undefined) {
    data.reviewComment = d.reviewComment.content;
    data.reviewCommentEnabled = d.reviewComment.enabled;
  }

  const updateData = { ...data };
  delete (updateData as { userId?: string }).userId;

  const updated = await prisma.feedbackPageCustomization.upsert({
    where: { userId: session.user.id },
    create: { ...updateData, userId: session.user.id },
    update: updateData,
  });

  return NextResponse.json(mapRow(updated));
}
