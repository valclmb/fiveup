import type { ShopifyOrder } from "@/app/api/shopify/webhooks/route";
import { prisma } from "@/lib/prisma";
import { scheduleReviewMessage } from "@/lib/qstash";
import { ORDER_REVIEW_REQUEST_SLUG } from "@/lib/campaigns";
import { getScheduledAt, ORDER_REVIEW_STATUS } from "@/lib/review-request";

interface WebhookContext {
  order: ShopifyOrder;
  store: {
    id: string;
    userId: string;
    shop: string;
  };
}

/** Gets the order phone number (checkout, shipping, billing or customer). */
export function getOrderPhone(order: ShopifyOrder): string | null {
  const raw =
    order.phone ??
    order.shipping_address?.phone ??
    order.billing_address?.phone ??
    order.customer?.phone ??
    null;
  const trimmed = typeof raw === "string" ? raw.trim() : "";
  return trimmed || null;
}

/** Gets the customer email (order or profile). */
export function getOrderEmail(order: ShopifyOrder): string | null {
  const raw = order.email ?? order.customer?.email ?? null;
  const trimmed = typeof raw === "string" ? raw.trim() : "";
  return trimmed || null;
}

/**
 * Called on each new order (orders/create).
 * Checks if an active UserCampaign exists for this store, otherwise skips.
 * Step B: save to DB (status: pending).
 * Step C: delay and channel from UserCampaign.
 */
export async function onNewOrder({ order, store }: WebhookContext) {
  const phone = getOrderPhone(order);
  const email = getOrderEmail(order);

  console.log(`🛒 New order ${order.name} on ${store.shop}`);

  // Check if user has active campaign for this store (trigger: purchase = orders/create)
  const userCampaign = await prisma.userCampaign.findFirst({
    where: {
      storeId: store.id,
      campaignSlug: ORDER_REVIEW_REQUEST_SLUG,
      status: "active",
      triggerType: "purchase",
    },
  });

  if (!userCampaign) {
    console.log(`⏭️ No active "order_review_request" campaign for ${store.shop}, skip`);
    return;
  }

  const { delayHours, channel } = userCampaign;

  // Validate channel vs available contact
  if (channel === "email" && !email) {
    console.log(`⏭️ Email channel selected but no customer email, skip`);
    return;
  }
  if ((channel === "sms" || channel === "whatsapp") && !phone) {
    console.log(`⏭️ ${channel} channel selected but no customer phone, skip`);
    return;
  }

  if (phone) {
    console.log(`📱 Customer phone: ${phone}`);
  } else {
    console.log("📱 No phone number in this order");
  }

  const scheduledAt = getScheduledAt(delayHours);

  const reviewRequest = await prisma.orderReviewRequest.upsert({
    where: {
      storeId_shopifyOrderId: {
        storeId: store.id,
        shopifyOrderId: String(order.id),
      },
    },
    create: {
      store: { connect: { id: store.id } },
      shopifyOrderId: String(order.id),
      customerPhone: phone ?? undefined,
      customerEmail: email ?? undefined,
      channel,
      scheduledAt,
      status: ORDER_REVIEW_STATUS.PENDING,
    },
    update: {
      customerPhone: phone ?? undefined,
      customerEmail: email ?? undefined,
      channel,
      scheduledAt,
      status: ORDER_REVIEW_STATUS.PENDING,
    },
  });

  console.log(
    `📋 OrderReviewRequest saved: id=${reviewRequest.id}, channel=${channel}, scheduledAt=${scheduledAt.toISOString()}, status=${reviewRequest.status}`,
  );

  const delay =
    process.env.QSTASH_DEV_DELAY ?? `${delayHours}h`;
  const messageId = await scheduleReviewMessage(reviewRequest.id, delay);
  if (messageId) {
    console.log(`⏰ QStash job scheduled: messageId=${messageId}, delay=${delay}`);
  } else {
    console.warn("⏰ QStash: job not scheduled (token or URL missing)");
  }

  console.log(order);
}


/** Same logic as onNewOrder but for shipment/receipt triggers (orders/fulfilled). */
export async function onOrderFulfilled({ order, store }: WebhookContext) {
  const phone = getOrderPhone(order);
  const email = getOrderEmail(order);

  console.log(`📦 Order shipped/fulfilled ${order.name} on ${store.shop}`);

  // Check if user has active campaign with shipment or receipt trigger
  const userCampaign = await prisma.userCampaign.findFirst({
    where: {
      storeId: store.id,
      campaignSlug: ORDER_REVIEW_REQUEST_SLUG,
      status: "active",
      triggerType: { in: ["shipment", "receipt"] },
    },
  });

  if (!userCampaign) {
    console.log(
      `⏭️ No active "order_review_request" (shipment/receipt) campaign for ${store.shop}, skip`
    );
    return;
  }

  const { delayHours, channel } = userCampaign;

  if (channel === "email" && !email) {
    console.log(`⏭️ Email channel selected but no customer email, skip`);
    return;
  }
  if ((channel === "sms" || channel === "whatsapp") && !phone) {
    console.log(`⏭️ ${channel} channel selected but no customer phone, skip`);
    return;
  }

  const scheduledAt = getScheduledAt(delayHours);

  const reviewRequest = await prisma.orderReviewRequest.upsert({
    where: {
      storeId_shopifyOrderId: {
        storeId: store.id,
        shopifyOrderId: String(order.id),
      },
    },
    create: {
      store: { connect: { id: store.id } },
      shopifyOrderId: String(order.id),
      customerPhone: phone ?? undefined,
      customerEmail: email ?? undefined,
      channel,
      scheduledAt,
      status: ORDER_REVIEW_STATUS.PENDING,
    },
    update: {
      customerPhone: phone ?? undefined,
      customerEmail: email ?? undefined,
      channel,
      scheduledAt,
      status: ORDER_REVIEW_STATUS.PENDING,
    },
  });

  console.log(
    `📋 OrderReviewRequest (fulfilled): id=${reviewRequest.id}, channel=${channel}, scheduledAt=${scheduledAt.toISOString()}`
  );

  const delay =
    process.env.QSTASH_DEV_DELAY ?? `${delayHours}h`;
  const messageId = await scheduleReviewMessage(reviewRequest.id, delay);
  if (messageId) {
    console.log(`⏰ QStash job scheduled: messageId=${messageId}, delay=${delay}`);
  } else {
    console.warn(`⏰ QStash: job not scheduled (token or URL missing)`);
  }
}
