import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { Button } from "../ui/button"
import Typography from "../ui/typography"
import { LandingBlock } from "./landing-block"

const faqItems = [
  {
    value: "question-1",
    question: "What is FiveUp?",
    answer: "Most brands are live in under 5 minutes. Connect Shopify (or WooCommerce / Wix), link your Google Business and Trustpilot accounts, choose when to send messages and pick a template. From there, FiveUp runs in the background.",
  },
  {
    value: "question-2",
    question: "Which platforms and tools do you integrate with?",
    answer: "FiveUp connects natively with Shopify, WooCommerce and Wix to pull your orders. For reviews, we integrate with Google Business and Trustpilot (more platforms are coming). Messages are sent via WhatsApp or email, depending on what you choose in each flow."
  },
  {
    value: "question-3",
    question: "Does FiveUp hide or delete bad reviews?",
    answer: "No. FiveUp never edits or deletes reviews on external platforms. We simply let you collect low-rating feedback in a private space first (WhatsApp or a feedback page), so you can solve issues directly with the customer before inviting them to leave a public review if they wish."
  },
  {
    value: "question-4",
    question: "Is FiveUp onfly for online stores?",
    answer: "FiveUp is built for brands that care about their reputation, whether you sell online, offline, or both. E-commerce stores, salons, clinics, gyms and local businesses can all use the same flows to grow reviews and protect their image."
  },
  {
    value: "question-5",
    question: "Do I need a developer or an agency to use FiveUp?",
    answer: "No. FiveUp is designed for founders and marketing teams. Setup is guided, there's no code to write, and you can change your flows, messages and rules directly from the dashboard whenever you need."
  }
]
export const Faq = () => {
  return (
    <LandingBlock className=" gap-24 ">
      <div className="flex  gap-24 max-w-7xl mx-auto min-h-[500px]">
        <div className="flex flex-col gap-6 w-1/2">
          <LandingBlock.Title className="max-w-full text-left mb-0">Frequently asked questions</LandingBlock.Title>
          <Typography variant="p" affects="mutedDescription"  >If you don’t find your answer here, our team is ready to help you set up FiveUp, connect your tools, and start getting more 5 star reviews.</Typography>
          <Button className="w-fit" variant="secondary">Contact support</Button>
        </div>
        <Accordion type="single" collapsible className="w-1/2">
          {faqItems.map((item) => (
            <AccordionItem value={item.value}>
              <AccordionTrigger>
                {item.question}
              </AccordionTrigger>
              <AccordionContent>
                <Typography variant="p" affects="mutedDescription"  >
                  {item.answer}
                </Typography>

              </AccordionContent>
            </AccordionItem>))}
        </Accordion>
      </div>
      <LandingBlock.Orb className="top-20 right-82" />
      <LandingBlock.Orb icon className="bottom-0 -left-20" />
    </LandingBlock>
  )
}