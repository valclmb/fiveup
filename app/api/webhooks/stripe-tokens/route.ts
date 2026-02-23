import { addTokens, TOKEN_TRANSACTION_REASON } from "@/lib/tokens";
import { NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET_TOKENS;

export async function POST(request: NextRequest) {
  console.log("[stripe-tokens] Webhook received");
  if (!WEBHOOK_SECRET) {
    console.error("stripe-tokens webhook: STRIPE_WEBHOOK_SECRET_TOKENS missing");
    return Response.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return Response.json({ error: "Missing stripe-signature" }, { status: 401 });
  }

  const rawBody = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, WEBHOOK_SECRET);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("stripe-tokens webhook: invalid signature", msg);
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  if (event.type !== "checkout.session.completed") {
    return Response.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const type = session.metadata?.type;
  if (type !== "token_pack") {
    return Response.json({ received: true });
  }

  const userId = session.metadata?.userId;
  const packId = session.metadata?.packId;
  const tokensStr = session.metadata?.tokens;
  if (!userId || !packId || !tokensStr) {
    console.error("stripe-tokens webhook: missing metadata", session.metadata);
    return Response.json({ error: "Invalid metadata" }, { status: 400 });
  }

  const tokens = parseInt(tokensStr, 10);
  if (!Number.isFinite(tokens) || tokens <= 0) {
    console.error("stripe-tokens webhook: invalid tokens", tokensStr);
    return Response.json({ error: "Invalid tokens" }, { status: 400 });
  }

  if (session.payment_status !== "paid") {
    return Response.json({ received: true });
  }

  try {
    await addTokens(userId, tokens, TOKEN_TRANSACTION_REASON.PURCHASE, {
      packId,
      stripeSessionId: session.id,
    });
  } catch (err) {
    console.error("stripe-tokens webhook: failed to credit user", {
      userId,
      tokens,
      err,
    });
    return Response.json(
      { error: "Failed to credit tokens" },
      { status: 500 },
    );
  }

  return Response.json({ received: true });
}
