import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getSignedUrlForDownload } from "@/lib/r2";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await prisma.globalStyles.findUnique({
    where: { userId: session.user.id },
    select: { brandLogoUrl: true },
  });

  let brandLogoUrl: string | null = null;
  if (settings?.brandLogoUrl) {
    brandLogoUrl = await getSignedUrlForDownload(settings.brandLogoUrl);
  }

  return NextResponse.json({
    brandLogoUrl,
  });
}
