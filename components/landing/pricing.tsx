import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
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
      <LandingBlock.Content className="flex gap-5">
        {pricingItems.map((item) => (
          <Card key={item.title} className="w-1/3 p-3 rounded-3xl">
            <Card className="relative rounded-xl space-y-4">
              <DotPattern
                glow
                width={10}
                height={10}
                className={cn(
                  "[mask-image:linear-gradient(to_bottom,white,transparent,transparent)]"
                )}
              />
              <CardHeader className="space-y-6">
                <CardTitle >
                  <Typography variant="h3" className="flex items-center gap-3">
                    {item.title} {item.isPopular && <Badge className="text-xs p-3 z-10 bg-white">Most Popular</Badge>}
                  </Typography>
                </CardTitle>
              </CardHeader>
              <CardContent className=" space-y-3">
                <Typography variant="p" >
                  <span className="text-7xl">€{item.price}</span>/mo
                </Typography>
                <Typography variant="p" className="text-xs" >
                  one time payment
                </Typography>



              </CardContent>
              <CardFooter>
                <Button className="w-full" size="lg" variant={item.isPopular ? "landing" : "secondary"} >
                  Get {item.title} Plan <ChevronRight className="size-4" />
                </Button>
              </CardFooter>
            </Card>

          </Card>
        ))}

      </LandingBlock.Content>
    </LandingBlock>
  )
}