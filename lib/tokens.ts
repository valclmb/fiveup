import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import {
  TOKEN_COST_EMAIL,
  TOKEN_COST_SMS,
  TOKEN_COST_WHATSAPP,
} from "./token-packs";

export { TOKEN_COST_EMAIL, TOKEN_COST_SMS, TOKEN_COST_WHATSAPP };

export type TokenChannel = "email" | "sms" | "whatsapp";

const COSTS: Record<TokenChannel, number> = {
  email: TOKEN_COST_EMAIL,
  sms: TOKEN_COST_SMS,
  whatsapp: TOKEN_COST_WHATSAPP,
};

export function getCost(channel: TokenChannel): number {
  return COSTS[channel] ?? COSTS.email;
}

/** Tokens granted on first signup. */
export const SIGNUP_BONUS_TOKENS = 50;

/** Tokens granted when user upgrades to a plan (one-time per upgrade). */
export const PLAN_UPGRADE_TOKENS: Record<string, number> = {
  pro: 100,
  ultra: 250,
};

export const TOKEN_TRANSACTION_REASON = {
  SIGNUP_BONUS: "signup_bonus",
  PLAN_UPGRADE: "plan_upgrade",
  PURCHASE: "purchase",
  CONSUMED_SMS: "consumed_sms",
  CONSUMED_EMAIL: "consumed_email",
  CONSUMED_WHATSAPP: "consumed_whatsapp",
} as const;

export type TokenTransactionReason =
  (typeof TOKEN_TRANSACTION_REASON)[keyof typeof TOKEN_TRANSACTION_REASON];

/** Token packs for one-time purchase (buy-tokens page). Re-exported from client-safe module. */
export { TOKEN_PACKS } from "./token-packs";

export async function getBalance(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { tokenBalance: true },
  });
  return user?.tokenBalance ?? 0;
}

/**
 * Credits tokens and creates a transaction. Used for signup bonus, plan upgrade, purchase.
 */
export async function addTokens(
  userId: string,
  amount: number,
  reason: TokenTransactionReason,
  metadata?: Record<string, unknown>,
): Promise<void> {
  if (amount <= 0) return;
  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { tokenBalance: { increment: amount } },
    });
    await tx.tokenTransaction.create({
      data: {
        userId,
        amount,
        reason,
        metadata: (metadata ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    });
  });
}

/**
 * Debits tokens and creates a transaction. Call only after provider (Twilio, etc.) returned success.
 */
export async function deductTokens(
  userId: string,
  amount: number,
  reason: TokenTransactionReason,
  metadata?: Record<string, unknown>,
): Promise<void> {
  if (amount <= 0) return;
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { tokenBalance: true },
    });
    if (!user || user.tokenBalance < amount) {
      throw new Error("Insufficient token balance");
    }
    await tx.user.update({
      where: { id: userId },
      data: { tokenBalance: { decrement: amount } },
    });
    await tx.tokenTransaction.create({
      data: {
        userId,
        amount: -amount,
        reason,
        metadata: (metadata ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    });
  });
}

/**
 * Grants signup bonus once per user (idempotent). Call from session/customSession.
 */
export async function ensureSignupBonus(userId: string): Promise<void> {
  const existing = await prisma.tokenTransaction.findFirst({
    where: { userId, reason: TOKEN_TRANSACTION_REASON.SIGNUP_BONUS },
    select: { id: true },
  });
  if (existing) return;
  await addTokens(userId, SIGNUP_BONUS_TOKENS, TOKEN_TRANSACTION_REASON.SIGNUP_BONUS);
}

export type PlanName = "free" | "pro" | "ultra";

/**
 * Grants plan upgrade tokens once per plan (idempotent). Call from customSession when plan is pro/ultra.
 */
export async function ensurePlanUpgradeBonus(
  userId: string,
  plan: PlanName,
): Promise<void> {
  if (plan === "free") return;
  const amount = PLAN_UPGRADE_TOKENS[plan];
  if (!amount) return;
  const existingList = await prisma.tokenTransaction.findMany({
    where: { userId, reason: TOKEN_TRANSACTION_REASON.PLAN_UPGRADE },
    select: { metadata: true },
  });
  const alreadyGranted = existingList.some(
    (t) => (t.metadata as { plan?: string } | null)?.plan === plan,
  );
  if (alreadyGranted) return;
  await addTokens(userId, amount, TOKEN_TRANSACTION_REASON.PLAN_UPGRADE, {
    plan,
  });
}
