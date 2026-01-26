import { auth } from "@/auth";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Vérifier que l'utilisateur est connecté
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/dashboard/integrations");
  }

  const { searchParams } = new URL(request.url);
  const shop = searchParams.get("shop");

  if (!shop) {
    return Response.json(
      { error: "Shop parameter is required" },
      { status: 400 },
    );
  }

  // Nettoyer le nom de la boutique (enlever .myshopify.com si présent)
  const shopName = shop.replace(".myshopify.com", "").trim();

  if (!shopName || !/^[a-zA-Z0-9-]+$/.test(shopName)) {
    return Response.json({ error: "Invalid shop name" }, { status: 400 });
  }

  const shopDomain = `${shopName}.myshopify.com`;

  // Générer un state pour la protection CSRF
  const state = crypto.randomUUID();

  // Stocker le state dans un cookie pour vérification au callback
  const cookieStore = await cookies();
  cookieStore.set("shopify_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes
    path: "/",
  });

  // Construire l'URL d'autorisation Shopify

  const redirectUri = `${process.env.BETTER_AUTH_URL}/api/shopify/callback`;
  const clientId = process.env.SHOPIFY_CLIENT_ID;

  if (!clientId) {
    return Response.json({ error: "Shopify not configured" }, { status: 500 });
  }

  const authUrl = new URL(`https://${shopDomain}/admin/oauth/authorize`);
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("state", state);

  redirect(authUrl.toString());
}
