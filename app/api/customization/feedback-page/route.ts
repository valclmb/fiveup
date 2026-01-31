import { auth } from "@/auth";
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

  const body = await request.json();

  const mapTogglable = (obj: unknown) =>
    typeof obj === "object" && obj !== null
      ? {
          content: (obj as { content?: string }).content ?? undefined,
          enabled: (obj as { enabled?: boolean }).enabled ?? undefined,
        }
      : {};

  const helpText = mapTogglable(body.helpText);
  const reviewTag = mapTogglable(body.reviewTag);
  const reviewTitle = mapTogglable(body.reviewTitle);
  const reviewComment = mapTogglable(body.reviewComment);

  const reviewTagOptions =
    Array.isArray(body.reviewTagOptions) && body.reviewTagOptions.every((x: unknown) => typeof x === "string")
      ? (body.reviewTagOptions as string[]).slice(0, 5)
      : undefined;

  const data = {
    title: body.title ?? undefined,
    ...(Object.keys(helpText).length && {
      helpText: helpText.content,
      helpTextEnabled: helpText.enabled,
    }),
    ...(Object.keys(reviewTag).length && {
      reviewTag: reviewTag.content,
      reviewTagEnabled: reviewTag.enabled,
    }),
    ...(reviewTagOptions !== undefined && { reviewTagOptions }),
    ...(Object.keys(reviewTitle).length && {
      reviewTitle: reviewTitle.content,
      reviewTitleEnabled: reviewTitle.enabled,
    }),
    ...(Object.keys(reviewComment).length && {
      reviewComment: reviewComment.content,
      reviewCommentEnabled: reviewComment.enabled,
    }),
  };

  const updated = await prisma.feedbackPageCustomization.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      ...data,
    },
    update: data,
  });

  return NextResponse.json(mapRow(updated));
}
