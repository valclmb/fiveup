import {
  ensurePlanBonusForPeriod,
  getCurrentMonthPeriod,
  type PlanName,
} from "@/lib/tokens";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { Receiver } from "@upstash/qstash";

/**
 * POST /api/cron/plan-bonus-monthly
 * Grants plan_bonus tokens for the current month to all users with an active subscription.
 * Idempotent: ensurePlanBonusForPeriod skips if already granted for (user, plan, period).
 *
 * Called by QStash Schedule (e.g. 1st of each month at 4 AM UTC).
 */
export async function POST(request: NextRequest) {
  const currentKey = process.env.QSTASH_CURRENT_SIGNING_KEY;
  const nextKey = process.env.QSTASH_NEXT_SIGNING_KEY;

  if (!currentKey || !nextKey) {
    console.error(
      "plan-bonus-monthly: QSTASH_CURRENT_SIGNING_KEY or QSTASH_NEXT_SIGNING_KEY missing",
    );
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
  const url = `${baseUrl}/api/cron/plan-bonus-monthly`;

  const isValid = await receiver.verify({
    body: rawBody,
    signature,
    url,
  });

  if (!isValid) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  const period = getCurrentMonthPeriod();
  const now = new Date();

  const subscriptions = await prisma.subscription.findMany({
    where: {
      OR: [
        { status: { in: ["active", "trialing"] }, periodEnd: { gt: now } },
        {
          cancelAtPeriodEnd: true,
          periodEnd: { gt: now },
        },
      ],
    },
    select: { referenceId: true, plan: true },
  });

  let granted = 0;
  for (const sub of subscriptions) {
    const plan = sub.plan.toLowerCase() as PlanName;
    if (plan !== "pro" && plan !== "ultra") continue;
    const ok = await ensurePlanBonusForPeriod(sub.referenceId, plan, period);
    if (ok) granted++;
  }

  console.log(
    `[plan-bonus-monthly] period=${period} subscriptions=${subscriptions.length} granted=${granted}`,
  );
  return Response.json({ period, processed: subscriptions.length, granted });
}
