import { cn } from "@/lib/utils"
import { CheckIcon, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Badge } from "../ui/badge"
import { buttonVariants } from "../ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { DotPattern } from "../ui/dot-pattern"
import Typography from "../ui/typography"
import { LandingBlock } from "./landing-block"

const pricingItems = [
  {
    title: "Starter",
    price: 49,
    features: [
      "Dashboard by rating (1–3★ → Support/Private feedback, 4–5★ → Public review flow)",
      "Automated post-purchase review requests (configurable delay)",
      "Track key metrics (conversion rate, review performance, satisfaction rate)"
    ],
  },
  {
    title: "Premium",
    price: 79,
    features: [
      "Win-back campaigns for silent customers (review request)",
      "Automatic reminders if the customer hasn’t replied",
      "Dynamic split to public platforms: Trustpilot / Google Reviews (configurable)"
    ],
    isPopular: true,
  },
  {
    title: "Entreprise",
    price: 129,
    features: [
      "Competitive insights / benchmarking (advanced use cases)",
      "Multi-language flows (FR / EN / ES)",
      "Multi-store / multi-brand management",
      "Open API + custom integrations"
    ],
  },
]
export const Pricing = () => {
  return (
    <LandingBlock>
      <LandingBlock.Badge>Pricing</LandingBlock.Badge>
      <LandingBlock.Title className="max-w-lg">Simple transparent pricing that works</LandingBlock.Title>
      <LandingBlock.Content className="flex items-start gap-5">
        {pricingItems.map((item) => (
          <Card key={item.title} className="w-1/3 p-3 rounded-4xl">
            <Card className="relative overflow-hidden rounded-2xl space-y-4">
              {/* Background glow for Most Popular */}
              {item.isPopular && (
                <div
                  className="pointer-events-none absolute inset-0  rounded-2xl bg-[radial-gradient(ellipse_100%_70%_at_40%_0%,color-mix(in_oklch,var(--primary)_25%,transparent)_0%,transparent_60%)]"
                  aria-hidden
                />
              )}
              <DotPattern
                glow
                width={10}
                height={10}
                opacity={item.isPopular ? 0.7 : 0.3}
                className={cn(
                  "[mask-image:linear-gradient(to_bottom,white,transparent,transparent)]",
                  item.isPopular && "text-primary/70"
                )}
              />
              <CardHeader className="space-y-6">
                <CardTitle >
                  <Typography variant="h3" className="flex items-center gap-3">
                    {item.title} {item.isPopular && <Badge className="text-xs p-3 z-10 bg-white">Most Popular</Badge>}
                  </Typography>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Typography variant="p" >
                  <span className="text-7xl">€{item.price}</span>/mo
                </Typography>
                <Typography variant="p" className="text-xs" >
                  one time payment
                </Typography>
              </CardContent>
              <CardFooter>
                <Link className={buttonVariants({ size: "lg", variant: item.isPopular ? "landing" : "secondary", className: "w-full", })} href="/pricing">
                  Get {item.title} Plan <ChevronRight className="size-4" />
                </Link>
              </CardFooter>
            </Card>

            <CardContent className="space-y-6 max-h-[250px]">
              <Typography variant="p" >
                What's included
              </Typography>
              <ul className="mt-3 flex flex-col gap-5 flex-1">
                {item.features.map((feature, index) => (
                  <li key={feature} className="flex items-start gap-4">
                    <Typography variant="p" affects="mutedDescription" className={cn("flex items-start gap-2.5", index === item.features.length - 1 && "opacity-5 blur-[1px]")}>
                      <CheckIcon size={18} strokeWidth={4} className={cn("mt-1.5 shrink-0 p-1 text-background rounded-full", item.isPopular ? "bg-primary" : "bg-foreground")}
                      />
                      {feature}
                    </Typography>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="justify-center pb-4 ">
              <Link href="/pricing" className={cn("flex items-center gap-2 hover:underline", item.isPopular && "text-primary")}>
                See details <ChevronRight size={16} /></Link>
            </CardFooter>
          </Card>
        ))}

      </LandingBlock.Content>
    </LandingBlock>
  )
}