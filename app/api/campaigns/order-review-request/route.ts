import { auth } from "@/auth";
import { ORDER_REVIEW_REQUEST_SLUG } from "@/lib/campaigns";
import { orderReviewRequestPatchSchema } from "@/lib/schemas";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = await prisma.shopifyStore.findFirst({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!store) {
    return NextResponse.json({
      userCampaign: null,
      storeId: null,
      hasStore: false,
    });
  }

  const userCampaign = await prisma.userCampaign.findUnique({
    where: {
      storeId_campaignSlug: {
        storeId: store.id,
        campaignSlug: ORDER_REVIEW_REQUEST_SLUG,
      },
    },
  });

  return NextResponse.json({
    userCampaign,
    storeId: store.id,
    hasStore: true,
  });
}

export async function PATCH(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = await prisma.shopifyStore.findFirst({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!store) {
    return NextResponse.json(
      { error: "Connect a Shopify store first" },
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = orderReviewRequestPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request data", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const userCampaign = await prisma.userCampaign.upsert({
    where: {
      storeId_campaignSlug: {
        storeId: store.id,
        campaignSlug: ORDER_REVIEW_REQUEST_SLUG,
      },
    },
    create: {
      userId: session.user.id,
      campaignSlug: ORDER_REVIEW_REQUEST_SLUG,
      storeId: store.id,
      status: data.status ?? "active",
      triggerType: data.triggerType ?? "purchase",
      delayHours: data.delayHours ?? 24,
      channel: data.channel ?? "email",
      messageContent: data.messageContent ?? undefined,
      thanksMessageEnabled: data.thanksMessageEnabled ?? true,
      thanksMessageContent: data.thanksMessageContent ?? undefined,
    },
    update: {
      ...(data.status !== undefined && { status: data.status }),
      ...(data.triggerType !== undefined && { triggerType: data.triggerType }),
      ...(data.delayHours !== undefined && { delayHours: data.delayHours }),
      ...(data.channel !== undefined && { channel: data.channel }),
      ...(data.messageContent !== undefined && { messageContent: data.messageContent }),
      ...(data.thanksMessageEnabled !== undefined && { thanksMessageEnabled: data.thanksMessageEnabled }),
      ...(data.thanksMessageContent !== undefined && { thanksMessageContent: data.thanksMessageContent }),
    },
  });

  return NextResponse.json({ userCampaign });
}

export async function DELETE() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = await prisma.shopifyStore.findFirst({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!store) {
    return NextResponse.json({ error: "No store" }, { status: 400 });
  }

  await prisma.userCampaign.deleteMany({
    where: {
      storeId: store.id,
      campaignSlug: ORDER_REVIEW_REQUEST_SLUG,
    },
  });

  return NextResponse.json({ success: true });
}
