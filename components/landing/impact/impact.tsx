import Typography from "../../ui/typography"
import { LandingBlock } from "../landing-block"
import { ImpactAutomatedFix, ImpactRatingInsights, ImpactReviewToChat } from "./impact-blocks"

const items = [{
  content: <ImpactReviewToChat />,
  title: "Turn bad reviews into real conversations",
  description: "Low ratings trigger a direct chat so you can resolve issues quickly on WhatsApp."
}, {
  content: <ImpactRatingInsights />,
  title: "Find the real reasons behind low ratings",
  description: "Group 1–3 star reviews by product, carrier, or issue to spot problems fast."
}, {
  content: <ImpactAutomatedFix />,
  title: "Set it once. Fix it forever.",
  description: "Turn recurring issues into automated  flows (delivery, damage, sizing…)."
}]
export const Impact = () => {
  return (
    <LandingBlock>
      <LandingBlock.Title>
        Finally understand the real impact of your reviews
      </LandingBlock.Title>
      <LandingBlock.Content className="grid grid-cols-3 gap-12.5">
        {items.map((item) => (
          <div key={item.title} className="flex flex-col gap-12.5">
            {item.content}
            <div className="flex flex-col gap-3">
              <Typography variant="h3">{item.title}</Typography>
              <Typography variant="p" affects="mutedDescription">{item.description}</Typography>
            </div>
          </div>
        ))}
      </LandingBlock.Content>
    </LandingBlock>
  )
}