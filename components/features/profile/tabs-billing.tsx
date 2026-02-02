"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TabsContent } from "@/components/ui/tabs";
import Typography from "@/components/ui/typography";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Calendar, CreditCard, ExternalLink } from "lucide-react";
import Link from "next/link";

type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "unpaid"
  | string
  | null;

interface SubscriptionItem {
  id: string;
  plan: string;
  status: SubscriptionStatus;
  periodStart?: string | Date | null;
  periodEnd?: string | Date | null;
  cancelAtPeriodEnd?: boolean | null;
  cancelAt?: string | Date | null;
  canceledAt?: string | Date | null;
  endedAt?: string | Date | null;
  trialStart?: string | Date | null;
  trialEnd?: string | Date | null;
}

function getActiveSubscription(subscriptions: SubscriptionItem[] | undefined): SubscriptionItem | null {
  if (!subscriptions?.length) return null;
  const now = new Date();
  for (const sub of subscriptions) {
    const status = (sub.status ?? "").toLowerCase();
    if (status === "active" || status === "trialing") return sub;
    if (sub.cancelAtPeriodEnd && sub.periodEnd && new Date(sub.periodEnd) > now) return sub;
  }
  return null;
}

function getBillingInterval(sub: SubscriptionItem): "monthly" | "annual" | null {
  const start = sub.periodStart ? new Date(sub.periodStart).getTime() : NaN;
  const end = sub.periodEnd ? new Date(sub.periodEnd).getTime() : NaN;
  if (Number.isNaN(start) || Number.isNaN(end)) return null;
  const days = (end - start) / (24 * 60 * 60 * 1000);
  return days >= 300 ? "annual" : "monthly";
}

function formatPlanName(plan: string): string {
  return plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase();
}

function formatDate(date: string | Date | null | undefined): string {
  if (date == null) return "—";
  return new Date(date).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function TabsBilling() {
  const { data: subscriptions, isLoading, error } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const res = await authClient.subscription.list();
      if (res.error) throw new Error(res.error.message);
      return (res.data ?? []) as unknown as SubscriptionItem[];
    },
  });

  const subscription = getActiveSubscription(subscriptions);
  const status = (subscription?.status ?? "").toLowerCase();
  const isTrialing = status === "trialing";
  const isCanceled = subscription?.cancelAtPeriodEnd === true;
  const billingInterval = subscription ? getBillingInterval(subscription) : null;

  if (isLoading) {
    return (
      <TabsContent value="billing">
        <Typography variant="h3" className="mb-4">
          Billing
        </Typography>
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-48" />
        </div>
      </TabsContent>
    );
  }

  if (error) {
    return (
      <TabsContent value="billing">
        <Typography variant="h3" className="mb-4">
          Billing
        </Typography>
        <Typography variant="description" className="text-destructive">
          Impossible de charger les informations d&apos;abonnement.
        </Typography>
        <Link
          href="/api/stripe/create-portal-session"
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ className: "mt-4" })}
        >
          Manage in Stripe <ExternalLink className="ml-2 size-4" />
        </Link>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="billing">
      <Typography variant="h3" className="mb-4">
        Billing
      </Typography>

      {subscription ? (
        <div className="space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="size-5 text-muted-foreground" />
                  <Typography variant="p" className="font-semibold">
                    Plan actuel
                  </Typography>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-primary/10 px-2 py-1 text-sm font-medium text-primary">
                    {formatPlanName(subscription.plan)}
                  </span>
                  {isTrialing && (
                    <span className="rounded-md bg-amber-500/15 px-2 py-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                      Essai
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-muted-foreground" />
                  <div>
                    <Typography variant="description" className="text-muted-foreground">
                      Prochain paiement
                    </Typography>
                    <Typography variant="p" className="font-medium">
                      {subscription.periodEnd
                        ? formatDate(subscription.periodEnd)
                        : "—"}
                    </Typography>
                  </div>
                </div>
                <div>
                  <Typography variant="description" className="text-muted-foreground">
                    Billing
                  </Typography>
                  <Typography variant="p" className="font-medium">
                    {billingInterval === "annual"
                      ? "Annuelle"
                      : billingInterval === "monthly"
                        ? "Mensuelle"
                        : "—"}
                  </Typography>
                </div>
              </div>

              {isCanceled && subscription.periodEnd && (
                <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                  <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-500" />
                  <div>
                    <Typography variant="p" className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      Cancellation scheduled
                    </Typography>
                    <Typography variant="description" className="text-sm text-amber-700 dark:text-amber-300">
                      Your access remains active until{" "}
                      <strong>{formatDate(subscription.periodEnd)}</strong>. You can reactivate your subscription from the Stripe portal.
                    </Typography>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Link
            href="/api/stripe/create-portal-session"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants()}
          >
            Gérer l&apos;abonnement dans Stripe <ExternalLink className="ml-2 size-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <Card className="border-border">
            <CardContent className="py-6">
              <Typography variant="p" className="font-medium">
                Plan actuel : Gratuit
              </Typography>
              <Typography variant="description" className="mt-1 text-muted-foreground">
                You don&apos;t have an active subscription. Upgrade to Pro or Ultra to unlock all features.
              </Typography>
            </CardContent>
          </Card>
          <Link
            href="/pricing"
            className={buttonVariants()}
          >
            Voir les offres
          </Link>
          <div className="pt-2">
            <Link
              href="/api/stripe/create-portal-session"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline" })}
            >
              Manage in Stripe <ExternalLink className="ml-2 size-4" />
            </Link>
          </div>
        </div>
      )}
    </TabsContent>
  );
}
