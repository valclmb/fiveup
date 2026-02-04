"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import Typography from "@/components/ui/typography"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { Check, Loader2, Zap } from "lucide-react"
import { useEffect, useState } from "react"

// Rewardful is loaded via script tag - types for global variables
declare global {
  interface Window {
    rewardful?: (method: string, callback?: () => void) => void
    Rewardful?: { referral: string }
  }
}

const PLANS = {
  pro: {
    monthly: { price: 30, period: "month" as const },
    yearly: { price: 200, period: "year" as const, savings: 160 },
    description: "Everything you need to grow your business",
    features: [
      "Unlimited reviews collection",
      "Advanced analytics dashboard",
      "Custom review pages",
      "Email notifications",
      "API access",
      "Priority support",
      "White-label options",
      "Advanced integrations",
    ],
  },
  ultra: {
    monthly: { price: 60, period: "month" as const },
    yearly: { price: 500, period: "year" as const, savings: 220 },
    description: "Maximum power for teams and scaling",
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "Custom integrations & webhooks",
      "Unlimited team seats",
      "SLA 99.9% uptime",
      "Advanced reporting & exports",
      "Phone support",
      "Onboarding & training",
    ],
  },
} as const

type PlanName = keyof typeof PLANS

export default function PricingPage() {
  const [referral, setReferral] = useState<string | null>(null)
  const [isYearly, setIsYearly] = useState(false)
  const [loadingPlan, setLoadingPlan] = useState<PlanName | null>(null)

  useEffect(() => {
    const rw = window.rewardful
    if (rw) {
      rw("ready", () => {
        const ref = window.Rewardful?.referral
        if (ref) setReferral(ref)
      })
    }
  }, [])

  const handleUpgrade = async (plan: PlanName) => {
    setLoadingPlan(plan)
    try {
      // Get referral at click time (Rewardful may have loaded since page load)
      const referralId =
        typeof window !== "undefined"
          ? window.Rewardful?.referral ?? referral
          : referral

      const { error } = await authClient.subscription.upgrade({
        plan,
        annual: isYearly,
        successUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/dashboard?success=subscription`,
        cancelUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/dashboard/pricing`,
        metadata: referralId ? { referral: referralId } : undefined,
      })


      if (error) {
        console.error("Erreur lors de l'upgrade:", error)
        setLoadingPlan(null)
      }
    } catch (error) {
      console.error("Erreur inattendue:", error)
      setLoadingPlan(null)
    }
  }



  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <Typography variant="h1" className="text-3xl md:text-4xl font-bold">
          Choose your plan
        </Typography>
        <Typography variant="description" className="text-muted-foreground">
          Pro or Ultra — upgrade or change your plan anytime via the Billing portal.
        </Typography>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Typography
          variant="p"
          className={cn("text-sm font-medium", !isYearly && "text-foreground")}
        >
          Monthly
        </Typography>
        <Switch
          checked={isYearly}
          onCheckedChange={setIsYearly}
          aria-label="Toggle billing period"
        />
        <div className="flex items-center gap-2">
          <Typography
            variant="p"
            className={cn("text-sm font-medium", isYearly && "text-foreground")}
          >
            Yearly
          </Typography>
          {isYearly && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              Save with annual billing
            </span>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pro */}
        <Card className="border-2 border-primary/20 relative overflow-hidden flex flex-col">
          <CardHeader className="text-center pb-6 pt-8">
            <CardTitle className="text-2xl mb-2">Pro Plan</CardTitle>
            <CardDescription className="text-base">
              {PLANS.pro.description}
            </CardDescription>
            <div className="mt-6">
              <div className="flex items-baseline justify-center gap-2">
                <Typography variant="h1" className="text-4xl font-bold">
                  $
                  {isYearly
                    ? PLANS.pro.yearly.price
                    : PLANS.pro.monthly.price}
                </Typography>
                <Typography variant="description" className="text-muted-foreground text-lg">
                  /{isYearly ? "year" : "month"}
                </Typography>
              </div>
              {isYearly && (
                <Typography variant="description" className="text-sm text-muted-foreground mt-2">
                  ${Math.round(PLANS.pro.yearly.price / 12)}/month billed annually
                </Typography>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6 flex-1 flex flex-col">
            <Button
              onClick={() => handleUpgrade("pro")}
              className="w-full"
              size="lg"
              variant="default"
              disabled={loadingPlan !== null}
            >
              {loadingPlan === "pro" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Upgrade to Pro"
              )}
            </Button>
            <div className="space-y-4 pt-4 border-t flex-1">
              <Typography variant="p" className="font-semibold text-sm">
                Included:
              </Typography>
              <ul className="space-y-3">
                {PLANS.pro.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      <Check className="size-5 text-primary" />
                    </div>
                    <Typography variant="description" className="text-sm">
                      {feature}
                    </Typography>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-4 pt-6 border-t">
            <Typography variant="description" className="text-xs text-muted-foreground">
              Change plan or billing later in Profile → Billing.
            </Typography>
          </CardFooter>
        </Card>

        {/* Ultra */}
        <Card className="border-2 border-primary relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1.5 text-xs font-semibold rounded-bl-lg z-10 flex items-center gap-1">
            <Zap className="size-3.5" />
            ULTRA
          </div>
          <CardHeader className="text-center pb-6 pt-8">
            <CardTitle className="text-2xl mb-2">Plan Ultra</CardTitle>
            <CardDescription className="text-base">
              {PLANS.ultra.description}
            </CardDescription>
            <div className="mt-6">
              <div className="flex items-baseline justify-center gap-2">
                <Typography variant="h1" className="text-4xl font-bold">
                  $
                  {isYearly
                    ? PLANS.ultra.yearly.price
                    : PLANS.ultra.monthly.price}
                </Typography>
                <Typography variant="description" className="text-muted-foreground text-lg">
                  /{isYearly ? "year" : "month"}
                </Typography>
              </div>
              {isYearly && (
                <Typography variant="description" className="text-sm text-muted-foreground mt-2">
                  ${Math.round(PLANS.ultra.yearly.price / 12)}/month billed annually
                </Typography>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6 flex-1 flex flex-col">
            <Button
              onClick={() => handleUpgrade("ultra")}
              className="w-full"
              size="lg"
              variant="default"
              disabled={loadingPlan !== null}
            >
              {loadingPlan === "ultra" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Upgrade to Ultra"
              )}
            </Button>
            <div className="space-y-4 pt-4 border-t flex-1">
              <Typography variant="p" className="font-semibold text-sm">
                Included:
              </Typography>
              <ul className="space-y-3">
                {PLANS.ultra.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      <Check className="size-5 text-primary" />
                    </div>
                    <Typography variant="description" className="text-sm">
                      {feature}
                    </Typography>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-4 pt-6 border-t">
            <Typography variant="description" className="text-xs text-muted-foreground">
              Upgrade, switch to annual, or cancel in Profile → Billing.
            </Typography>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
