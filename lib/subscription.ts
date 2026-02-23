import { prisma } from "@/lib/prisma";

export type PlanName = "free" | "pro" | "ultra";

/**
 * Returns the user's plan name: "free" | "pro" | "ultra".
 *
 * How subscription end is handled:
 * - Stripe sends customer.subscription.updated (or .deleted) when a subscription ends;
 *   Better Auth handles the webhook and sets status to "canceled" in the DB.
 * - We only consider subscriptions that are still valid: status "active" with periodEnd in the
 *   future, or cancelAtPeriodEnd with periodEnd in the future. So even if a webhook is missed,
 *   an expired subscription (periodEnd in the past) never counts as active.
 */
export async function getActivePlanForUser(userId: string): Promise<PlanName> {
  const now = new Date();
  const sub = await prisma.subscription.findFirst({
    where: {
      referenceId: userId,
      OR: [
        { status: "active", periodEnd: { gt: now } },
        {
          cancelAtPeriodEnd: true,
          periodEnd: { gt: now },
        },
      ],
    },
    select: { plan: true },
    orderBy: { periodEnd: "desc" },
  });
  if (!sub?.plan) return "free";
  return sub.plan.toLowerCase() as PlanName;
}
