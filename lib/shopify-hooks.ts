import type { ShopifyOrder } from "@/app/api/shopify/webhooks/route";
import { prisma } from "@/lib/prisma";
import { scheduleReviewMessage } from "@/lib/qstash";
import { getScheduledAt, ORDER_REVIEW_STATUS, REVIEW_REQUEST_DELAY_HOURS } from "@/lib/review-request";

interface WebhookContext {
  order: ShopifyOrder;
  store: {
    id: string;
    userId: string;
    shop: string;
  };
}

/** Récupère le numéro de téléphone de la commande (checkout, livraison, facturation ou client). */
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

/** Récupère l'email du client (commande ou profil). */
export function getOrderEmail(order: ShopifyOrder): string | null {
  const raw = order.email ?? order.customer?.email ?? null;
  const trimmed = typeof raw === "string" ? raw.trim() : "";
  return trimmed || null;
}

/**
 * Appelé à chaque nouvelle commande (orders/create).
 * Étape B : sauvegarde en BDD (status: pending).
 * Étape C : délai configuré (pour l'instant 1h via REVIEW_REQUEST_DELAY_HOURS).
 */
export async function onNewOrder({ order, store }: WebhookContext) {
  const phone = getOrderPhone(order);
  const email = getOrderEmail(order);

  console.log(`🛒 Nouvelle commande ${order.name} sur ${store.shop}`);

  if (phone) {
    console.log(`📱 Téléphone client: ${phone}`);
  } else {
    console.log("📱 Aucun numéro de téléphone dans cette commande");
  }

  // Étape B : sauvegarder la commande en BDD (status: pending)
  // Étape C : délai = 1h pour l'instant (config marchand à venir)
  const scheduledAt = getScheduledAt();

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
      scheduledAt,
      status: ORDER_REVIEW_STATUS.PENDING,
    },
    update: {
      customerPhone: phone ?? undefined,
      customerEmail: email ?? undefined,
      scheduledAt,
      status: ORDER_REVIEW_STATUS.PENDING,
    },
  });

  console.log(
    `📋 OrderReviewRequest enregistré: id=${reviewRequest.id}, scheduledAt=${scheduledAt.toISOString()}, status=${reviewRequest.status}`,
  );

  // Étape D : programmer l'appel à /api/send-review-message via QStash
  // En local : QSTASH_DEV_DELAY=2m pour tester sans attendre 24h
  const delay =
    process.env.QSTASH_DEV_DELAY ?? `${REVIEW_REQUEST_DELAY_HOURS}h`;
  const messageId = await scheduleReviewMessage(reviewRequest.id, delay);
  if (messageId) {
    console.log(`⏰ QStash job programmé: messageId=${messageId}, delay=${delay}`);
  } else {
    console.warn("⏰ QStash: job non programmé (token ou URL manquants)");
  }

  // Exemple : log des infos
  console.log(order);
}


export async function onOrderFulfilled({ order, store }: WebhookContext) {
  console.log(`📦 Commande livrée ${order.name} sur ${store.shop}`);

  const customerEmail = order.email || order.customer?.email;
  const customerName = order.customer?.first_name || "Client";
  const phone = getOrderPhone(order);

  if (!customerEmail) {
    console.log("Pas d'email client, impossible d'envoyer une demande d'avis");
    return;
  }

  // TODO: Ajoute ta logique de demande d'avis ici
  // Exemples :
  // - Envoyer un email de demande d'avis
  // - Programmer l'envoi dans X jours avec une queue
  // - Créer un lien de review unique

  console.log(`📧 Envoyer demande d'avis à ${customerName} (${customerEmail})${phone ? ` — Tél: ${phone}` : ""}`);

  // Exemple avec les produits achetés
  const products = order.line_items.map((item) => ({
    id: item.product_id,
    name: item.title,
    quantity: item.quantity,
  }));

  console.log("Produits à reviewer:", products);

  // await sendReviewRequestEmail({
  //   to: customerEmail,
  //   customerName,
  //   orderNumber: order.name,
  //   products,
  //   storeId: store.id,
  // });
}
