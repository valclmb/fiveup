import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function GET() {
  // Vérifier que l'utilisateur est connecté
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const stores = await prisma.shopifyStore.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        shop: true,
        scope: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ stores });
  } catch (error) {
    console.error("Error fetching Shopify stores:", error);
    return Response.json({ error: "Failed to fetch stores" }, { status: 500 });
  }
}
