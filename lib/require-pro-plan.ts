import { NextResponse } from "next/server";

type SessionWithPlan = { user: { id: string; plan?: string } };

/**
 * Returns a 403 response if the user is on the free plan.
 * Use in API routes that must be restricted to Pro (e.g. customization write).
 * Call after validating session exists.
 */
export function requireProPlanForWrite(
  session: SessionWithPlan | null
): NextResponse | null {
  if (!session?.user) return null;
  const plan = (session.user as { plan?: string }).plan ?? "free";
  if (plan === "free") {
    return NextResponse.json(
      { error: "Upgrade to Pro to save customization" },
      { status: 403 }
    );
  }
  return null;
}
