import { auth } from "@/auth";
import {
  CUSTOM_AMOUNT_MAX,
  CUSTOM_AMOUNT_MIN,
  PRICE_PER_TOKEN_EUR,
  TOKEN_PACKS,
} from "@/lib/token-packs";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { packId?: string; amount?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const baseUrl =
    process.env.BETTER_AUTH_URL?.replace(/\/+$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

  // Custom amount (slider)
  if (typeof body.amount === "number") {
    const amount = Math.floor(body.amount);
    if (amount < CUSTOM_AMOUNT_MIN || amount > CUSTOM_AMOUNT_MAX) {
      return NextResponse.json(
        {
          error: "Invalid amount",
          min: CUSTOM_AMOUNT_MIN,
          max: CUSTOM_AMOUNT_MAX,
        },
        { status: 400 },
      );
    }
    try {
      const totalAmountCents = Math.round(amount * PRICE_PER_TOKEN_EUR * 100);
      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: session.user.email ?? undefined,
        line_items: [
          {
            price_data: {
              currency: "eur",
              unit_amount: totalAmountCents,
              product_data: {
                name: `${amount} tokens`,
                description: "One-time purchase — tokens never expire.",
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${baseUrl}/buy-tokens?success=1&tokens=${amount}`,
        cancel_url: `${baseUrl}/buy-tokens?canceled=1`,
        client_reference_id: session.user.id,
        metadata: {
          type: "token_pack",
          userId: session.user.id,
          packId: "custom",
          tokens: String(amount),
        },
      });
      return NextResponse.json({ url: checkoutSession.url });
    } catch (err) {
      console.error("create-checkout-session tokens (custom):", err);
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 },
      );
    }
  }

  // Fixed pack
  const packId = body.packId;
  const pack = TOKEN_PACKS.find((p) => p.id === packId);
  if (!pack) {
    return NextResponse.json(
      { error: "Invalid pack", packId },
      { status: 400 },
    );
  }

  const priceId = process.env[pack.priceIdEnv];
  if (!priceId) {
    console.error(`create-checkout-session tokens: missing env ${pack.priceIdEnv}`);
    return NextResponse.json(
      { error: "Token pack not configured" },
      { status: 500 },
    );
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: session.user.email ?? undefined,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/buy-tokens?success=1`,
      cancel_url: `${baseUrl}/buy-tokens?canceled=1`,
      client_reference_id: session.user.id,
      metadata: {
        type: "token_pack",
        userId: session.user.id,
        packId: pack.id,
        tokens: String(pack.tokens),
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("create-checkout-session tokens:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
