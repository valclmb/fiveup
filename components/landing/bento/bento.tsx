import { cn } from "@/lib/utils"
import { Card, CardContent } from "../../ui/card"
import Typography from "../../ui/typography"
import { LandingBlock } from "../landing-block"
import { BentoConnect, BentoFlow, BentoReplies, BentoReputation, BentoSetup } from "./bento-block"

const featuresItem = [
  {
    title: "Set up in 4 minutes and run automatically",
    description: "Connect your store, set your review timing, and FiveUp pulls orders and starts collecting reviews on autopilot.",
    className: "col-span-3",
    content: <BentoSetup />
  },
  {
    title: "Connect CMS, Trustpilot & Google in one click",
    description: "Link your store and FiveUp automatically sets up or connects your Trustpilot and Google profiles.",
    className: "col-span-3",
    content: <BentoConnect />
  },
  {
    title: "Automated replies and follow-ups",
    description: "Create reply templates once, and FiveUp responds and follows up automatically.",
    className: "col-span-2",
    content: <BentoReplies />
  },
  {
    title: "Safeguard your reputation",
    description: "Create flows between WhatsApp and your review pages for easy customer contact.",
    className: "col-span-2",
    content: <BentoReputation />
  },
  {
    title: "Fully customizable flows",
    description: "Control what happens after each order. No developer needed and fully editable.",
    className: "col-span-2",
    content: <BentoFlow />
  },
]
export const Features = () => {
  return (
    <LandingBlock>
      <LandingBlock.Badge>Features</LandingBlock.Badge>
      <LandingBlock.Title>Make reviews work for you</LandingBlock.Title>
      <LandingBlock.Content className="grid grid-cols-6 gap-4">
        {featuresItem.map((item) => (
          <Card variant="landing" key={item.title} className={cn(item.className, "p-7.5")}>
            <CardContent className="p-0">
              <div className="h-60">
                {item.content}
              </div>
              <Typography variant="h3">{item.title}</Typography>
              <Typography variant="p" affects="mutedDescription">{item.description}</Typography>
            </CardContent>
          </Card>
        ))}


      </LandingBlock.Content>
    </LandingBlock>
  )
}