import Image from "next/image"
import Typography from "../ui/typography"
import { LandingBlock } from "./landing-block"

const items = [{
  icon: "/landing/benefits-shop.svg",
  title: "Setup in minutes",
  description: "Connect Shopify, WooCommerce, or Wix in a few clicks. FiveUp imports orders and sends review requests automatically, no developer needed."
},
{
  icon: "/landing/benefits-stars.svg",
  title: "Turn feedback into reviews",
  description: "FiveUp makes it easy for customers to share their experience on Google or Trustpilot, or contact your team via email or WhatsApp, all in one seamless flow."
},
{
  icon: "/landing/benefits-dollars.svg",
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

        {items.map(item => (
          <div className="flex flex-col items-center justify-start text-center w-78 gap-6">


            <div className="p-[5px] bg-pill-background rounded-2xl">
              <div className="border border-secondary 
              bg-[radial-gradient(72.15%_68.18%_at_50%_14.2%,var(--pill-gradient)_0%,var(--pill)_100%)] 
              size-[60px] flex items-center justify-center rounded-lg
              shadow-[0_6px_12px_rgba(0,0,0,0.8)]">
                <Image
                  width={25}
                  height={25}
                  src={item.icon}
                  alt="icon"
                />
              </div>


            </div>
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