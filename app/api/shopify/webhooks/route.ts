import { shopifyWebhookOrderSchema, type ShopifyWebhookOrder } from "@/lib/schemas";
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

  let order: ShopifyWebhookOrder | null = null;
  if (topic === "orders/create" || topic === "orders/fulfilled") {
    let parsedBody: unknown;
    try {
      parsedBody = JSON.parse(body);
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const parsed = shopifyWebhookOrderSchema.safeParse(parsedBody);
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid webhook payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    order = parsed.data;
  }

  const isComplianceWebhook =
    topic === "customers/redact" || topic === "shop/redact" || topic === "customers/data_request";

  try {
    const store = await prisma.shopifyStore.findUnique({
      where: { shop },
      select: { id: true, userId: true, shop: true },
    });

    if (!store && !isComplianceWebhook) {
      console.error(`Store not found: ${shop}`);
      return Response.json({ error: "Store not found" }, { status: 404 });
    }

    switch (topic) {
      case "orders/create":
        if (order && store) await onNewOrder({ order: order as ShopifyOrder, store });
        break;

      case "orders/fulfilled":
        if (order && store) await onOrderFulfilled({ order: order as ShopifyOrder, store });
        break;

      case "app/uninstalled":
        if (store) await prisma.shopifyStore.delete({ where: { shop } });
        console.log(`App uninstalled from ${shop}`);
        break;

      case "customers/redact": {
        // GDPR: store owner requested deletion of customer data. Payload: shop_id, shop_domain, customer { id, email, phone }, orders_to_redact
        try {
          const payload = JSON.parse(body) as {
            shop_domain?: string;
            customer?: { id?: number; email?: string; phone?: string };
            orders_to_redact?: number[];
          };
          const shopDomain = payload.shop_domain ?? shop;
          const storeForRedact = await prisma.shopifyStore.findUnique({
            where: { shop: shopDomain },
            select: { id: true },
          });
          if (storeForRedact) {
            const orderIds = (payload.orders_to_redact ?? []).map(String);
            const customerEmail = payload.customer?.email;
            const customerPhone = payload.customer?.phone;
            if (orderIds.length > 0) {
              await prisma.orderReviewRequest.updateMany({
                where: {
                  storeId: storeForRedact.id,
                  shopifyOrderId: { in: orderIds },
                },
                data: { customerEmail: null, customerPhone: null },
              });
            } else if (customerEmail || customerPhone) {
              await prisma.orderReviewRequest.updateMany({
                where: {
                  storeId: storeForRedact.id,
                  ...(customerEmail && customerPhone
                    ? { OR: [{ customerEmail: customerEmail }, { customerPhone: customerPhone }] }
                    : customerEmail
                      ? { customerEmail: customerEmail }
                      : { customerPhone: customerPhone }),
                },
                data: { customerEmail: null, customerPhone: null },
              });
            }
          }
        } catch (e) {
          console.error("customers/redact handling error:", e);
        }
        break;
      }

      case "shop/redact": {
        // GDPR: 48h after uninstall. Payload: shop_id, shop_domain – erase all shop data
        try {
          const payload = JSON.parse(body) as { shop_domain?: string };
          const shopDomain = payload.shop_domain ?? shop;
          const storeForRedact = await prisma.shopifyStore.findUnique({
            where: { shop: shopDomain },
            select: { id: true },
          });
          if (storeForRedact) {
            await prisma.orderReviewRequest.updateMany({
              where: { storeId: storeForRedact.id },
              data: { customerEmail: null, customerPhone: null },
            });
          }
        } catch (e) {
          console.error("shop/redact handling error:", e);
        }
        break;
      }

      case "customers/data_request":
        // GDPR: customer requested to view their data. Payload: shop_id, shop_domain, customer, orders_requested, data_request.id
        // We store only order review request PII; no separate export flow – acknowledge receipt with 200
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

// Type exporté pour utilisation dans les hooks (champs principaux + téléphone)
export interface ShopifyOrder {
  id: number;
  name: string; // "#1001"
  order_number: number;
  email?: string;
  /** Téléphone saisi au checkout (niveau commande) */
  phone?: string | null;
  created_at: string;
  total_price: string;
  currency: string;
  fulfillment_status: string | null;
  financial_status: string;
  customer?: {
    id: number;
    email?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    /** Téléphone du client (profil) */
    phone?: string | null;
  };
  line_items: Array<{
    id: number;
    title: string;
    quantity: number;
    price: string;
    product_id: number;
  }>;
  /** Adresse de facturation (contient souvent le téléphone) */
  billing_address?: {
    first_name?: string | null;
    last_name?: string | null;
    address1?: string | null;
    city?: string | null;
    country?: string | null;
    phone?: string | null;
  };
  /** Adresse de livraison (contient souvent le téléphone) */
  shipping_address?: {
    first_name?: string | null;
    last_name?: string | null;
    address1?: string | null;
    city?: string | null;
    country?: string | null;
    phone?: string | null;
  };
}
