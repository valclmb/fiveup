import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { avatarKey, getSignedUrlForDownload, uploadToR2 } from "@/lib/r2";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { image: true },
  });

  const image = user?.image;
  if (!image) {
    return NextResponse.json({ avatarUrl: null });
  }

  // URL OAuth (ex: Google) → retourner telle quelle
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return NextResponse.json({ avatarUrl: image });
  }

  // Clé R2 → générer une URL signée
  try {
    const avatarUrl = await getSignedUrlForDownload(image);
    return NextResponse.json({ avatarUrl });
  } catch {
    return NextResponse.json({ avatarUrl: null });
  }
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "Missing or invalid file" },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File too large (max 2 MB)" },
      { status: 400 },
    );
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Type not allowed (JPEG, PNG, WebP only)" },
      { status: 400 },
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const key = avatarKey(session.user.id, file.name);
    await uploadToR2(buffer, key, file.type);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: key, updatedAt: new Date() },
    });

    const signedUrl = await getSignedUrlForDownload(key);
    return NextResponse.json({ url: signedUrl });
  } catch (err) {
    console.error("Upload avatar:", err);
    return NextResponse.json(
      { error: "Upload error" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { image: true },
  });

  // Ne supprimer que si c'est notre clé R2 (pas une URL OAuth)
  const image = user?.image;
  const isR2Key = image && !image.startsWith("http://") && !image.startsWith("https://");

  await prisma.user.update({
    where: { id: session.user.id },
    data: { image: null, updatedAt: new Date() },
  });

  // TODO: supprimer l'objet R2 si isR2Key (optionnel, pour libérer l'espace)

  return new NextResponse(null, { status: 204 });
}
