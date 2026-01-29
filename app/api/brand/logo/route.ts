import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

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
