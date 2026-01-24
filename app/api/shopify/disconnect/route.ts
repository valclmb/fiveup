import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  // Vérifier que l'utilisateur est connecté
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { storeId } = body;

    if (!storeId) {
      return Response.json({ error: "Store ID is required" }, { status: 400 });
    }

    // Supprimer la boutique (seulement si elle appartient à l'utilisateur)
    const result = await prisma.shopifyStore.deleteMany({
      where: {
        id: storeId,
        userId: session.user.id,
      },
    });

    if (result.count === 0) {
      return Response.json({ error: "Store not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error disconnecting Shopify store:", error);
    return Response.json({ error: "Failed to disconnect store" }, { status: 500 });
  }
}
