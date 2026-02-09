import { auth } from "@/auth";
import { ORDER_REVIEW_REQUEST_SLUG } from "@/lib/campaigns";
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

  const body = await request.json();

  const status = body.status as "active" | "paused" | undefined;
  const triggerType = body.triggerType as "purchase" | "shipment" | "receipt" | undefined;
  const delayHours = body.delayHours as number | undefined;
  const channel = body.channel as "email" | "sms" | "whatsapp" | undefined;
  const messageContent = body.messageContent as string | undefined;
  const thanksMessageEnabled = body.thanksMessageEnabled as boolean | undefined;
  const thanksMessageContent = body.thanksMessageContent as string | undefined;

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
      status: status ?? "active",
      triggerType: triggerType ?? "purchase",
      delayHours: delayHours ?? 24,
      channel: channel ?? "email",
      messageContent: messageContent ?? undefined,
      thanksMessageEnabled: thanksMessageEnabled ?? true,
      thanksMessageContent: thanksMessageContent ?? undefined,
    },
    update: {
      ...(status !== undefined && { status }),
      ...(triggerType !== undefined && { triggerType }),
      ...(delayHours !== undefined && { delayHours }),
      ...(channel !== undefined && { channel }),
      ...(messageContent !== undefined && { messageContent }),
      ...(thanksMessageEnabled !== undefined && { thanksMessageEnabled }),
      ...(thanksMessageContent !== undefined && { thanksMessageContent }),
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
