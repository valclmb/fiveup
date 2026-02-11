import { auth } from "@/auth";
import { requireProPlanForWrite } from "@/lib/require-pro-plan";
import { reviewPagePatchSchema } from "@/lib/schemas";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const DEFAULTS = {
  title: "How would you rate your experience?",
  ratingTemplate: "arc-stars" as const,
  buttonText: "Continuer",
} as const;

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const row = await prisma.reviewPageCustomization.findUnique({
    where: { userId: session.user.id },
  });

  if (!row) {
    return NextResponse.json(DEFAULTS);
  }

  return NextResponse.json({
    title: row.title ?? DEFAULTS.title,
    ratingTemplate: (row.ratingTemplate ?? DEFAULTS.ratingTemplate) as
      | "arc-stars"
      | "classic",
    buttonText: row.buttonText ?? DEFAULTS.buttonText,
  });
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

  const parsed = reviewPagePatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request data", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const d = parsed.data;
  const data = {
    ...(d.title !== undefined && { title: d.title }),
    ...(d.ratingTemplate !== undefined && { ratingTemplate: d.ratingTemplate }),
    ...(d.buttonText !== undefined && { buttonText: d.buttonText }),
  };

  const updated = await prisma.reviewPageCustomization.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      ...data,
    },
    update: data,
  });

  return NextResponse.json({
    title: updated.title ?? DEFAULTS.title,
    ratingTemplate: (updated.ratingTemplate ?? DEFAULTS.ratingTemplate) as
      | "arc-stars"
      | "classic",
    buttonText: updated.buttonText ?? DEFAULTS.buttonText,
  });
}
