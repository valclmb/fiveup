import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const DEFAULT_DESCRIPTION = { enabled: false, content: "" } as const;

const DEFAULTS = {
  title: "Merci pour votre avis",
  buttonText: "Continuer",
  description: DEFAULT_DESCRIPTION,
} as const;

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const row = await prisma.redirectionPageCustomization.findUnique({
    where: { userId: session.user.id },
  });

  if (!row) {
    return NextResponse.json({
      title: DEFAULTS.title,
      buttonText: DEFAULTS.buttonText,
      description: DEFAULTS.description,
    });
  }

  return NextResponse.json({
    title: row.title ?? DEFAULTS.title,
    buttonText: row.buttonText ?? DEFAULTS.buttonText,
    description: {
      enabled: row.descriptionEnabled ?? false,
      content: row.description ?? "",
    },
  });
}

export async function PATCH(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const desc = body.description;

  const data = {
    title: body.title ?? undefined,
    buttonText: body.buttonText ?? undefined,
    ...(typeof desc === "object" && desc !== null && {
      description: desc.content ?? undefined,
      descriptionEnabled: desc.enabled ?? undefined,
    }),
  };

  const updated = await prisma.redirectionPageCustomization.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      ...data,
    },
    update: data,
  });

  return NextResponse.json({
    title: updated.title ?? DEFAULTS.title,
    buttonText: updated.buttonText ?? DEFAULTS.buttonText,
    description: {
      enabled: updated.descriptionEnabled ?? false,
      content: updated.description ?? "",
    },
  });
}
