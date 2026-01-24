import { prisma } from "@/lib/prisma";
import { onNewOrder, onOrderFulfilled } from "@/lib/shopify-hooks";
import crypto from "crypto";
import { NextRequest } from "next/server";

// Vérifier la signature HMAC du webhook Shopify
function verifyWebhookSignature(
  body: string,
  hmacHeader: string | null,
): boolean {
  if (!hmacHeader) return false;

  const secret = process.env.SHOPIFY_CLIENT_SECRET;
  if (!secret) return false;

  const calculatedHmac = crypto
    .createHmac("sha256", secret)
    .update(body, "utf8")
    .digest("base64");

  return crypto.timingSafeEqual(
    new Uint8Array(Buffer.from(hmacHeader)),
    new Uint8Array(Buffer.from(calculatedHmac)),
  );
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const hmacHeader = request.headers.get("x-shopify-hmac-sha256");
  const topic = request.headers.get("x-shopify-topic");
  const shop = request.headers.get("x-shopify-shop-domain");

  // Vérifier la signature
  if (!verifyWebhookSignature(body, hmacHeader)) {
    console.error("Invalid webhook signature");
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  if (!shop) {
    return Response.json({ error: "Missing shop header" }, { status: 400 });
  }

  const order: ShopifyOrder = JSON.parse(body);

  try {
    // Trouver le store associé pour avoir le userId
    const store = await prisma.shopifyStore.findUnique({
      where: { shop },
      select: { id: true, userId: true, shop: true },
    });

    if (!store) {
      console.error(`Store not found: ${shop}`);
      return Response.json({ error: "Store not found" }, { status: 404 });
    }

    // Gérer les différents types de webhooks
    switch (topic) {
      case "orders/create":
        await onNewOrder({ order, store });
        break;

      case "orders/fulfilled":
        await onOrderFulfilled({ order, store });
        break;

      case "app/uninstalled":
        await prisma.shopifyStore.delete({ where: { shop } });
        console.log(`App uninstalled from ${shop}`);
        break;

      default:
        console.log(`Unhandled webhook topic: ${topic}`);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return Response.json({ error: "Processing failed" }, { status: 500 });
  }
}

// Type exporté pour utilisation dans les hooks
export interface ShopifyOrder {
  id: number;
  name: string; // "#1001"
  order_number: number;
  email?: string;
  created_at: string;
  total_price: string;
  currency: string;
  fulfillment_status: string | null;
  financial_status: string;
  customer?: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
  };
  line_items: Array<{
    id: number;
    title: string;
    quantity: number;
    price: string;
    product_id: number;
  }>;
  shipping_address?: {
    first_name: string;
    last_name: string;
    address1: string;
    city: string;
    country: string;
  };
}
