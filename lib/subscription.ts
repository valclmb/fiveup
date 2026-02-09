import { prisma } from "@/lib/prisma";

/**
 * Checks if a user has an active (paid) subscription.
 * Free users have no subscription or only past/canceled subscriptions.
 */
export async function userHasActiveSubscription(userId: string): Promise<boolean> {
  const now = new Date();
  const sub = await prisma.subscription.findFirst({
    where: {
      referenceId: userId,
      OR: [
        { status: { in: ["active", "trialing"] } },
        {
          cancelAtPeriodEnd: true,
          periodEnd: { gt: now },
        },
      ],
    },
  });
  return !!sub;
}
