import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  brandLogoKey,
  getSignedUrlForDownload,
  uploadToR2,
} from "@/lib/r2";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "Fichier manquant ou invalide" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Fichier trop volumineux (max 2 Mo)" },
      { status: 400 }
    );
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Type non autorisé (JPEG, PNG, WebP, SVG uniquement)" },
      { status: 400 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const key = brandLogoKey(session.user.id, file.name);
    await uploadToR2(buffer, key, file.type);

    await prisma.brandSettings.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        brandLogoUrl: key,
      },
      update: { brandLogoUrl: key, updatedAt: new Date() },
    });

    const signedUrl = await getSignedUrlForDownload(key);
    return NextResponse.json({ url: signedUrl });
  } catch (err) {
    console.error("Upload brand logo:", err);
    return NextResponse.json(
      { error: "Erreur lors de l’upload" },
      { status: 500 }
    );
  }
}
