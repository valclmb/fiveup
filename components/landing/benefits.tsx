import Dollar from "@/public/landing/benefits-dollars.svg"
import Shop from "@/public/landing/benefits-shop.svg"
import Star from "@/public/landing/benefits-stars.svg"
import { Pills } from "../custom-ui/pills"
import Typography from "../ui/typography"
import { LandingBlock } from "./landing-block"
const items = [{
  icon: Shop,
  title: "Setup in minutes",
  description: "Connect Shopify, WooCommerce, or Wix in a few clicks. FiveUp imports orders and sends review requests automatically, no developer needed."
},
{
  icon: Star,
  title: "Turn feedback into reviews",
  description: "FiveUp makes it easy for customers to share their experience on Google or Trustpilot, or contact your team via email or WhatsApp, all in one seamless flow."
},
{
  icon: Dollar,
  title: "Turn reputation into revenue",
  description: "Higher scores and new reviews boost conversions on product pages, landing pages, and ads. FiveUp turns your reviews into a growth engine."
}]

export const Benefits = () => {
  return (
    <LandingBlock className="mt-24">
      <LandingBlock.Orb icon className="top-24 right-10 " />
      <LandingBlock.Badge>Key benefits</LandingBlock.Badge>
      <LandingBlock.Title>
        More reviews, higher ratings, increased revenue
      </LandingBlock.Title>
      <LandingBlock.Content className="flex justify-between">

        {items.map((item, index) => (
          <div key={index} className="flex flex-col items-center justify-start text-center w-78 gap-6">
            <Pills variant="button">
              <item.icon className="fill-foreground size-6" />

            </Pills>
            <div className="flex flex-col gap-3">
              <Typography variant="h3">
                {item.title}
              </Typography>
              <Typography variant="p" affects="muted" >
                {item.description}
              </Typography>
            </div>

          </div>
        ))}

      </LandingBlock.Content>
    </LandingBlock>
  )
}