import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

const SHOPIFY_API_VERSION = "2026-01";

// Enregistrer les webhooks après connexion OAuth
// Note: Ne fonctionne qu'en production (https requis)
async function registerWebhooks(shop: string, accessToken: string) {
  const baseUrl = process.env.BETTER_AUTH_URL || "";

  // Skip webhook registration en localhost (Shopify n'accepte que https)
  if (baseUrl.includes("localhost") || baseUrl.startsWith("http://")) {
    console.log(
      "⚠️  Skipping webhook registration (localhost). Use ngrok or deploy to production.",
    );
    return;
  }

  const webhookUrl = `${baseUrl}/api/shopify/webhooks`;

  // Mandatory compliance webhooks (GDPR/CPRA): https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance
  // If using Shopify CLI, also add in shopify.app.toml: [webhooks] → subscriptions with compliance_topics
  const webhooksToRegister = [
    { topic: "orders/create", address: webhookUrl },
    { topic: "orders/fulfilled", address: webhookUrl },
    { topic: "app/uninstalled", address: webhookUrl },
    { topic: "customers/redact", address: webhookUrl },
    { topic: "shop/redact", address: webhookUrl },
    { topic: "customers/data_request", address: webhookUrl },
  ];

  for (const webhook of webhooksToRegister) {
    try {
      const response = await fetch(
        `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/webhooks.json`,
        {
          method: "POST",
          headers: {
            "X-Shopify-Access-Token": accessToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            webhook: {
              topic: webhook.topic,
              address: webhook.address,
              format: "json",
            },
          }),
        },
      );

      if (!response.ok) {
        const error = await response.text();
        console.error(`Failed to register webhook ${webhook.topic}:`, error);
      } else {
        console.log(`✓ Webhook registered: ${webhook.topic}`);
      }
    } catch (error) {
      console.error(`Error registering webhook ${webhook.topic}:`, error);
    }
  }
}

// Vérifier le HMAC de Shopify pour la sécurité
function verifyShopifyHmac(query: URLSearchParams): boolean {
  const hmac = query.get("hmac");
  if (!hmac) return false;

  const secret = process.env.SHOPIFY_CLIENT_SECRET;
  if (!secret) return false;

  // Créer une copie des params sans le hmac
  const params = new URLSearchParams(query);
  params.delete("hmac");

  // Trier les paramètres alphabétiquement
  const sortedParams = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const calculatedHmac = crypto
    .createHmac("sha256", secret)
    .update(sortedParams)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      new Uint8Array(Buffer.from(hmac)),
      new Uint8Array(Buffer.from(calculatedHmac)),
    );
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  // Vérifier que l'utilisateur est connecté
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const shop = searchParams.get("shop");
  const state = searchParams.get("state");

  // Vérifier les paramètres requis
  if (!code || !shop || !state) {
    redirect("/dashboard?error=shopify:invalid_callback");
  }

  // Vérifier le state pour la protection CSRF
  const cookieStore = await cookies();
  const storedState = cookieStore.get("shopify_oauth_state")?.value;

  if (!storedState || storedState !== state) {
    redirect("/dashboard?error=shopify:invalid_state");
  }

  // Supprimer le cookie state
  cookieStore.delete("shopify_oauth_state");

  // Vérifier le HMAC de Shopify (optionnel mais recommandé)
  if (!verifyShopifyHmac(searchParams)) {
    console.warn("Shopify HMAC verification failed");
    // On continue quand même car certaines configs peuvent ne pas avoir de HMAC
  }

  // Échanger le code contre un access_token
  const tokenResponse = await fetch(
    `https://${shop}/admin/oauth/access_token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.SHOPIFY_CLIENT_ID,
        client_secret: process.env.SHOPIFY_CLIENT_SECRET,
        code,
      }),
    },
  );

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    console.error("Shopify token exchange failed:", errorText);
    redirect("/dashboard?error=shopify:token_exchange_failed");
  }

  const tokenData = await tokenResponse.json();
  const { access_token, scope } = tokenData;

  if (!access_token) {
    redirect("/dashboard?error=shopify:no_access_token");
  }

  // Stocker ou mettre à jour la boutique en BDD
  // On met à jour userId lors d'une reconnexion pour réassigner la boutique à l'utilisateur actuel
  await prisma.shopifyStore.upsert({
    where: { shop },
    create: {
      userId: session.user.id,
      shop,
      accessToken: access_token,
      scope: scope || "",
    },
    update: {
      userId: session.user.id,
      accessToken: access_token,
      scope: scope || "",
      updatedAt: new Date(),
    },
  });

  // Enregistrer les webhooks pour recevoir les commandes
  // (skip en localhost, fonctionne seulement en production avec https)
  await registerWebhooks(shop, access_token);

  // Rediriger vers le dashboard avec succès
  redirect("/connections?success=shopify:connected");
}
