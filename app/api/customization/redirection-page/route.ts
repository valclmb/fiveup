import { auth } from "@/auth";
import { redirectionPagePatchSchema } from "@/lib/schemas";
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = redirectionPagePatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request data", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const d = parsed.data;
  const data = {
    ...(d.title !== undefined && { title: d.title }),
    ...(d.buttonText !== undefined && { buttonText: d.buttonText }),
    ...(d.description !== undefined && {
      description: d.description.content,
      descriptionEnabled: d.description.enabled,
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
