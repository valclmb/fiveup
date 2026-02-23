import { auth } from "@/auth";
import { shopifyDisconnectPostSchema } from "@/lib/schemas";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = shopifyDisconnectPostSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid request data", details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const { storeId } = parsed.data;

    // Delete store only if it belongs to the user
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
