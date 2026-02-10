import {
  DEFAULT_ORDER_REVIEW_MESSAGE,
  ORDER_REVIEW_REQUEST_SLUG,
} from "@/lib/campaigns";
import { prisma } from "@/lib/prisma";
import { ORDER_REVIEW_STATUS } from "@/lib/review-request";
import { sendReviewMessageBodySchema } from "@/lib/schemas";
import { sendSms } from "@/lib/twilio";
import { Receiver } from "@upstash/qstash";
import { NextRequest } from "next/server";

/** Replace template variables in message content for SMS/email. */
function replaceMessageVariables(
  template: string,
  opts: {
    orderNumber?: string;
    customerFirstName?: string;
    reviewLink?: string;
  },
): string {
  return template
    .replace(/\{\{order_number\}\}/g, opts.orderNumber ?? "")
    .replace(
      /\{\{customer_first_name\}\}/g,
      opts.customerFirstName ?? "Customer",
    )
    .replace(/\{\{customer_last_name\}\}/g, "")
    .replace(/\{\{review_link\}\}/g, opts.reviewLink ?? "");
}

/** Vérifie la signature QStash et exécute la logique d'envoi de la demande d'avis. */
export async function POST(request: NextRequest) {
  const currentKey = process.env.QSTASH_CURRENT_SIGNING_KEY;
  const nextKey = process.env.QSTASH_NEXT_SIGNING_KEY;

  if (!currentKey || !nextKey) {
    console.error(
      "send-review-message: QSTASH_CURRENT_SIGNING_KEY ou QSTASH_NEXT_SIGNING_KEY manquant",
    );
    return Response.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const signature = request.headers.get("Upstash-Signature");
  if (!signature) {
    return Response.json(
      { error: "Missing Upstash-Signature" },
      { status: 401 },
    );
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

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = sendReviewMessageBodySchema.safeParse(parsedBody);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid request data", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { orderReviewRequestId } = parsed.data;

  const reviewRequest = await prisma.orderReviewRequest.findUnique({
    where: { id: orderReviewRequestId },
    include: { store: true },
  });

  if (!reviewRequest) {
    return Response.json(
      { error: "OrderReviewRequest not found" },
      { status: 404 },
    );
  }

  if (reviewRequest.status !== ORDER_REVIEW_STATUS.PENDING) {
    console.log(
      `send-review-message: id=${orderReviewRequestId} déjà traité (status=${reviewRequest.status}), skip`,
    );
    return Response.json({ ok: true, skipped: true });
  }

  const { channel, customerEmail, customerPhone, customerFirstName } =
    reviewRequest;

  try {
    // Use campaign config for message body (delay & trigger were used at schedule time in webhooks)
    const userCampaign = await prisma.userCampaign.findUnique({
      where: {
        storeId_campaignSlug: {
          storeId: reviewRequest.storeId,
          campaignSlug: ORDER_REVIEW_REQUEST_SLUG,
        },
      },
      select: { messageContent: true, delayHours: true, triggerType: true },
    });

    const template =
      userCampaign?.messageContent?.trim() || DEFAULT_ORDER_REVIEW_MESSAGE;
    if (userCampaign?.messageContent?.trim()) {
      console.log(
        `send-review-message: using configured message template (delay=${userCampaign.delayHours}h, trigger=${userCampaign.triggerType})`
      );
    }

    const reviewLinkBase =
      process.env.REVIEW_COLLECTION_BASE_URL?.replace(/\/+$/, "") ||
      process.env.BETTER_AUTH_URL?.replace(/\/+$/, "") ||
      "https://fiveup.com";
    const body = replaceMessageVariables(template, {
      orderNumber: reviewRequest.shopifyOrderId,
      customerFirstName: customerFirstName?.trim() || "Customer",
      reviewLink: `${reviewLinkBase}/review`,
    });

    if (channel === "sms") {
      if (!customerPhone) {
        console.warn(
          `send-review-message: SMS channel but no customerPhone for id=${orderReviewRequestId}`,
        );
        await prisma.orderReviewRequest.update({
          where: { id: orderReviewRequestId },
          data: { status: ORDER_REVIEW_STATUS.FAILED },
        });
        return Response.json(
          { error: "No phone number for SMS" },
          { status: 400 },
        );
      }
      try {
        await sendSms(customerPhone, body);
        console.log(
          `send-review-message: SMS sent for orderReviewRequestId=${orderReviewRequestId}, store=${reviewRequest.store.shop}`,
        );
      } catch (smsErr: unknown) {
        const msg = smsErr instanceof Error ? smsErr.message : String(smsErr);
        console.error(`send-review-message: SMS failed (To may be unsupported for your Twilio From number): ${msg}`);
        throw smsErr;
      }
    } else if (channel === "email" || channel === "whatsapp") {
      console.log(
        `send-review-message: channel=${channel} not implemented yet for id=${orderReviewRequestId}, marking as SENT (no-op)`,
      );
    }

    await prisma.orderReviewRequest.update({
      where: { id: orderReviewRequestId },
      data: { status: ORDER_REVIEW_STATUS.SENT },
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("send-review-message error:", err);
    await prisma.orderReviewRequest
      .update({
        where: { id: orderReviewRequestId },
        data: { status: ORDER_REVIEW_STATUS.FAILED },
      })
      .catch(() => {});
    return Response.json({ error: "Processing failed" }, { status: 500 });
  }
}
