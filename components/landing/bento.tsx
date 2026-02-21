import { cn } from "@/lib/utils"
import { Card, CardContent } from "../ui/card"
import Typography from "../ui/typography"
import { LandingBlock } from "./landing-block"

const featuresItem = [
  {
    title: "Set up in 4 minutes and run automatically",
    description: "Connect your store, set your review timing, and FiveUp pulls orders and starts collecting reviews on autopilot.",
    className: "col-span-3",
    content: <>TEST</>
  },
  {
    title: "Connect CMS, Trustpilot & Google in one click",
    description: "Link your store and FiveUp automatically sets up or connects your Trustpilot and Google profiles.",
    className: "col-span-3",
  },
  {
    title: "Automated replies and follow-ups",
    description: "Create reply templates once, and FiveUp responds and follows up automatically.",
    className: "col-span-2",
  },
  {
    title: "Safeguard your reputation",
    description: "Create flows between WhatsApp and your review pages for easy customer contact.",
    className: "col-span-2",
  },
  {
    title: "Fully customizable flows",
    description: "Control what happens after each order. No developer needed and fully editable.",
    className: "col-span-2",
  },
]
export const Features = () => {
  return (
    <LandingBlock>
      <LandingBlock.Badge>Features</LandingBlock.Badge>
      <LandingBlock.Title>Make reviews work for you</LandingBlock.Title>
      <LandingBlock.Content className="grid grid-cols-6 gap-4">
        {featuresItem.map((item) => (
          <Card key={item.title} className={cn(item.className, "p-9")}>
            <CardContent className="p-0">
              {item.content}
              <Typography variant="h3">{item.title}</Typography>
              <Typography variant="p" affects="mutedDescription">{item.description}</Typography>
            </CardContent>
          </Card>
        ))}


      </LandingBlock.Content>
    </LandingBlock>
  )
}