import { prisma } from "@/lib/prisma";

const SHOPIFY_API_VERSION = "2026-01";

interface ShopifyOrder {
  id: number;
  email: string;
  created_at: string;
  customer: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
  } | null;
  line_items: Array<{
    id: number;
    title: string;
    quantity: number;
    price: string;
  }>;
  fulfillment_status: string | null;
  financial_status: string;
}

interface ShopifyCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  orders_count: number;
  total_spent: string;
  created_at: string;
}

interface ShopifyShopInfo {
  id: number;
  name: string;
  email: string;
  domain: string;
  myshopify_domain: string;
  currency: string;
  timezone: string;
}

/**
 * Récupère les informations de la boutique
 */
export async function getShopInfo(shop: string, accessToken: string): Promise<ShopifyShopInfo> {
  const response = await fetch(
    `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/shop.json`,
    {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch shop info: ${response.statusText}`);
  }

  const data = await response.json();
  return data.shop;
}

/**
 * Récupère les commandes d'une boutique
 */
export async function getOrders(
  shop: string, 
  accessToken: string,
  options: {
    status?: "any" | "open" | "closed" | "cancelled";
    limit?: number;
    since_id?: number;
    fulfillment_status?: "shipped" | "partial" | "unshipped" | "any" | "unfulfilled";
  } = {}
): Promise<ShopifyOrder[]> {
  const params = new URLSearchParams({
    status: options.status || "any",
    limit: String(options.limit || 50),
  });

  if (options.since_id) {
    params.set("since_id", String(options.since_id));
  }
  if (options.fulfillment_status) {
    params.set("fulfillment_status", options.fulfillment_status);
  }

  const response = await fetch(
    `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/orders.json?${params}`,
    {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch orders: ${response.statusText}`);
  }

  const data = await response.json();
  return data.orders;
}

/**
 * Récupère les clients d'une boutique
 */
export async function getCustomers(
  shop: string,
  accessToken: string,
  options: {
    limit?: number;
    since_id?: number;
  } = {}
): Promise<ShopifyCustomer[]> {
  const params = new URLSearchParams({
    limit: String(options.limit || 50),
  });

  if (options.since_id) {
    params.set("since_id", String(options.since_id));
  }

  const response = await fetch(
    `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/customers.json?${params}`,
    {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch customers: ${response.statusText}`);
  }

  const data = await response.json();
  return data.customers;
}

/**
 * Récupère une commande spécifique
 */
export async function getOrder(
  shop: string,
  accessToken: string,
  orderId: number
): Promise<ShopifyOrder> {
  const response = await fetch(
    `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/orders/${orderId}.json`,
    {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch order: ${response.statusText}`);
  }

  const data = await response.json();
  return data.order;
}

/**
 * Récupère les commandes livrées (pour envoyer des demandes d'avis)
 */
export async function getDeliveredOrders(
  shop: string,
  accessToken: string,
  limit: number = 50
): Promise<ShopifyOrder[]> {
  return getOrders(shop, accessToken, {
    status: "any",
    fulfillment_status: "shipped",
    limit,
  });
}

/**
 * Récupère la boutique Shopify connectée d'un utilisateur
 */
export async function getUserShopifyStore(userId: string) {
  return prisma.shopifyStore.findFirst({
    where: { userId },
  });
}

/**
 * Récupère toutes les boutiques Shopify d'un utilisateur
 */
export async function getUserShopifyStores(userId: string) {
  return prisma.shopifyStore.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Déconnecte une boutique Shopify
 */
export async function disconnectShopifyStore(storeId: string, userId: string) {
  return prisma.shopifyStore.deleteMany({
    where: {
      id: storeId,
      userId, // S'assurer que l'utilisateur possède cette boutique
    },
  });
}
