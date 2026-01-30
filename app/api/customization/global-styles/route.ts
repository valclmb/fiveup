import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const DEFAULT_STYLES = {
  font: "inter",
  cornerRoundness: "md",
  buttonCornerRoundness: "md",
  borderColor: "#000000",
  buttonBgColor: "#000000",
  buttonTextColor: "#FFFFFF",
  starsColor: "#FFD230",
  bgColor: "#FFFFFF",
  textColor: "#000000",
  cardColor: "#FFFFFF",
} as const;

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const row = await prisma.globalStyles.findUnique({
    where: { userId: session.user.id },
  });

  if (!row) {
    return NextResponse.json(DEFAULT_STYLES);
  }

  const result = {
    font: row.font ?? DEFAULT_STYLES.font,
    cornerRoundness: row.cornerRoundness ?? DEFAULT_STYLES.cornerRoundness,
    buttonCornerRoundness:
      row.buttonCornerRoundness ?? DEFAULT_STYLES.buttonCornerRoundness,
    borderColor: row.borderColor ?? DEFAULT_STYLES.borderColor,
    buttonBgColor: row.buttonBgColor ?? DEFAULT_STYLES.buttonBgColor,
    buttonTextColor: row.buttonTextColor ?? DEFAULT_STYLES.buttonTextColor,
    starsColor: row.starsColor ?? DEFAULT_STYLES.starsColor,
    bgColor: row.bgColor ?? DEFAULT_STYLES.bgColor,
    textColor: row.textColor ?? DEFAULT_STYLES.textColor,
    cardColor: row.cardColor ?? DEFAULT_STYLES.cardColor,
  };

  return NextResponse.json(result);
}

export async function PATCH(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const data = {
    font: body.font ?? undefined,
    cornerRoundness: body.cornerRoundness ?? undefined,
    buttonCornerRoundness: body.buttonCornerRoundness ?? undefined,
    borderColor: body.borderColor ?? undefined,
    buttonBgColor: body.buttonBgColor ?? undefined,
    buttonTextColor: body.buttonTextColor ?? undefined,
    starsColor: body.starsColor ?? undefined,
    bgColor: body.bgColor ?? undefined,
    textColor: body.textColor ?? undefined,
    cardColor: body.cardColor ?? undefined,
  };

  const updated = await prisma.globalStyles.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      ...data,
    },
    update: data,
  });

  return NextResponse.json({
    font: updated.font ?? DEFAULT_STYLES.font,
    cornerRoundness: updated.cornerRoundness ?? DEFAULT_STYLES.cornerRoundness,
    buttonCornerRoundness:
      updated.buttonCornerRoundness ?? DEFAULT_STYLES.buttonCornerRoundness,
    borderColor: updated.borderColor ?? DEFAULT_STYLES.borderColor,
    buttonBgColor: updated.buttonBgColor ?? DEFAULT_STYLES.buttonBgColor,
    buttonTextColor: updated.buttonTextColor ?? DEFAULT_STYLES.buttonTextColor,
    starsColor: updated.starsColor ?? DEFAULT_STYLES.starsColor,
    bgColor: updated.bgColor ?? DEFAULT_STYLES.bgColor,
    textColor: updated.textColor ?? DEFAULT_STYLES.textColor,
    cardColor: updated.cardColor ?? DEFAULT_STYLES.cardColor,
  });
}
