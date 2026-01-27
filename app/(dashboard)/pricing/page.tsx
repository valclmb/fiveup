"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import Typography from "@/components/ui/typography"
import { Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

const PRICING = {
  monthly: {
    price: 30,
    period: "month",
  },
  yearly: {
    price: 200,
    period: "year",
    savings: 160, // 30 * 12 - 200 = 360 - 200 = 160
  },
}

const FEATURES = [
  "Unlimited reviews collection",
  "Advanced analytics dashboard",
  "Custom review pages",
  "Email notifications",
  "API access",
  "Priority support",
  "White-label options",
  "Advanced integrations",
]

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const currentPricing = isYearly ? PRICING.yearly : PRICING.monthly

  const handleUpgrade = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await authClient.subscription.upgrade({
        plan: "pro",
        annual: isYearly,
        successUrl: `${window.location.origin}/dashboard?success=subscription`,
        cancelUrl: `${window.location.origin}/dashboard/pricing`,
      })

      if (error) {
        console.error("Erreur lors de l'upgrade:", error)
        // Vous pouvez ajouter une notification d'erreur ici
        setIsLoading(false)
      }
      // Si pas d'erreur, l'utilisateur sera redirigé vers Stripe Checkout
      // Le plugin gère automatiquement la redirection
    } catch (error) {
      console.error("Erreur inattendue:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <Typography variant="h1" className="text-3xl md:text-4xl font-bold">
          Choose your plan
        </Typography>
        <Typography variant="description" className="text-muted-foreground">
          Unlock all features with the Pro plan
        </Typography>
      </div>

      {/* Billing Toggle */}
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
              Save ${PRICING.yearly.savings}
            </span>
          )}
        </div>
      </div>

      {/* Pricing Card */}
      <Card className="border-2 border-primary/20 relative overflow-hidden">
        {isYearly && (
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1.5 text-xs font-semibold rounded-bl-lg z-10">
            BEST VALUE
          </div>
        )}
        <CardHeader className="text-center pb-8 pt-8">
          <CardTitle className="text-2xl mb-2">Pro Plan</CardTitle>
          <CardDescription className="text-base">
            Everything you need to grow your business
          </CardDescription>
          <div className="mt-6">
            <div className="flex items-baseline justify-center gap-2">
              <Typography variant="h1" className="text-5xl font-bold">
                ${currentPricing.price}
              </Typography>
              <Typography variant="description" className="text-muted-foreground text-lg">
                /{currentPricing.period}
              </Typography>
            </div>
            {isYearly && (
              <Typography variant="description" className="text-sm text-muted-foreground mt-2">
                ${Math.round(currentPricing.price / 12)}/month billed annually
              </Typography>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Button
            onClick={handleUpgrade}
            className="w-full"
            size="lg"
            variant="default"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Upgrade to Pro"
            )}
          </Button>

          <div className="space-y-4 pt-4 border-t">
            <Typography variant="p" className="font-semibold text-sm">
              Everything included:
            </Typography>
            <ul className="space-y-3">
              {FEATURES.map((feature, index) => (
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
            All plans include a 14-day free trial. Cancel anytime.
          </Typography>
        </CardFooter>
      </Card>
    </div>
  )
}
