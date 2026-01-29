import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getSignedUrlForDownload } from "@/lib/r2";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const row = await prisma.globalStyles.findUnique({
    where: { userId: session.user.id },
    select: { brandLogoUrl: true },
  });

  let brandLogoUrl: string | null = null;
  if (row?.brandLogoUrl) {
    try {
      brandLogoUrl = await getSignedUrlForDownload(row.brandLogoUrl);
    } catch {
      brandLogoUrl = null;
    }
  }

  return NextResponse.json({ brandLogoUrl });
}

export async function DELETE() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  await prisma.globalStyles.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, brandLogoUrl: null },
    update: { brandLogoUrl: null },
  });

  return new NextResponse(null, { status: 204 });
}
