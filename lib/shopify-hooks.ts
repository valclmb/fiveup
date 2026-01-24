import type { ShopifyOrder } from "@/app/api/shopify/webhooks/route";

interface WebhookContext {
  order: ShopifyOrder;
  store: {
    id: string;
    userId: string;
    shop: string;
  };
}

/**
 * Appelé à chaque nouvelle commande
 * C'est ici que tu peux déclencher tes actions !
 */
export async function onNewOrder({ order, store }: WebhookContext) {
  console.log(`🛒 Nouvelle commande ${order.name} sur ${store.shop}`);

  // const customerEmail = order.email || order.customer?.email;
  // const customerName = order.customer
  //   ? `${order.customer.first_name} ${order.customer.last_name}`
  //   : "Client";

  // Exemple : log des infos
  console.log(order);

  // TODO: Ajoute ta logique ici
  // Exemples :
  // - Envoyer un email de confirmation personnalisé
  // - Ajouter le client à une liste marketing
  // - Notifier via Slack/Discord
  // - Créer une tâche dans ton CRM
}

/**
 * Appelé quand une commande est livrée (fulfilled)
 * Moment idéal pour demander un avis !
 */
export async function onOrderFulfilled({ order, store }: WebhookContext) {
  console.log(`📦 Commande livrée ${order.name} sur ${store.shop}`);

  const customerEmail = order.email || order.customer?.email;
  const customerName = order.customer?.first_name || "Client";

  if (!customerEmail) {
    console.log("Pas d'email client, impossible d'envoyer une demande d'avis");
    return;
  }

  // TODO: Ajoute ta logique de demande d'avis ici
  // Exemples :
  // - Envoyer un email de demande d'avis
  // - Programmer l'envoi dans X jours avec une queue
  // - Créer un lien de review unique

  console.log(`📧 Envoyer demande d'avis à ${customerName} (${customerEmail})`);

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
