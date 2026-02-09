import { prisma } from "@/lib/prisma";
import { ORDER_REVIEW_STATUS } from "@/lib/review-request";
import { Receiver } from "@upstash/qstash";
import { NextRequest } from "next/server";

/** Vérifie la signature QStash et exécute la logique d'envoi de la demande d'avis. */
export async function POST(request: NextRequest) {
  const currentKey = process.env.QSTASH_CURRENT_SIGNING_KEY;
  const nextKey = process.env.QSTASH_NEXT_SIGNING_KEY;

  if (!currentKey || !nextKey) {
    console.error("send-review-message: QSTASH_CURRENT_SIGNING_KEY ou QSTASH_NEXT_SIGNING_KEY manquant");
    return Response.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const signature = request.headers.get("Upstash-Signature");
  if (!signature) {
    return Response.json({ error: "Missing Upstash-Signature" }, { status: 401 });
  }

  const rawBody = await request.text();
  const receiver = new Receiver({
    currentSigningKey: currentKey,
    nextSigningKey: nextKey,
  });

  const baseUrl =
    process.env.BETTER_AUTH_URL?.replace(/\/+$/, "") ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  const url = `${baseUrl}/api/send-review-message`;

  const isValid = await receiver.verify({
    body: rawBody,
    signature,
    url,
  });

  if (!isValid) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: { orderReviewRequestId?: string };
  try {
    body = JSON.parse(rawBody) as { orderReviewRequestId?: string };
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const orderReviewRequestId = body.orderReviewRequestId;
  if (!orderReviewRequestId || typeof orderReviewRequestId !== "string") {
    return Response.json({ error: "Missing orderReviewRequestId" }, { status: 400 });
  }

  const reviewRequest = await prisma.orderReviewRequest.findUnique({
    where: { id: orderReviewRequestId },
    include: { store: true },
  });

  if (!reviewRequest) {
    return Response.json({ error: "OrderReviewRequest not found" }, { status: 404 });
  }

  if (reviewRequest.status !== ORDER_REVIEW_STATUS.PENDING) {
    console.log(`send-review-message: id=${orderReviewRequestId} déjà traité (status=${reviewRequest.status}), skip`);
    return Response.json({ ok: true, skipped: true });
  }

  try {
    // TODO: Envoyer via channel choisi (email / WhatsApp / SMS) - customerEmail, customerPhone, store, customizations
    const { channel, customerEmail, customerPhone } = reviewRequest;
    console.log(
      `send-review-message: envoi demandé pour orderReviewRequestId=${orderReviewRequestId}, store=${reviewRequest.store.shop}, channel=${channel}, email=${customerEmail ?? "—"}, phone=${customerPhone ?? "—"}`,
    );

    await prisma.orderReviewRequest.update({
      where: { id: orderReviewRequestId },
      data: { status: ORDER_REVIEW_STATUS.SENT },
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("send-review-message error:", err);
    await prisma.orderReviewRequest.update({
      where: { id: orderReviewRequestId },
      data: { status: ORDER_REVIEW_STATUS.FAILED },
    }).catch(() => {});
    return Response.json({ error: "Processing failed" }, { status: 500 });
  }
}
