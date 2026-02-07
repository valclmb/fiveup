import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import Typography from "@/components/ui/typography";
import { AnimatedSection } from "./animated-wrapper";

const faqItems = [
  {
    question: "How long does it take to set up FiveUp?",
    answer: "Most brands are live in under 5 minutes. Connect Shopify (or WooCommerce / Wix), link your Google Business and Trustpilot accounts, choose when to send messages and pick a template. From there, FiveUp runs in the background."
  },
  {
    question: "Which platforms and tools do you integrate with?",
    answer: "FiveUp connects natively with Shopify, WooCommerce and Wix to pull your orders. For reviews, we integrate with Google Business and Trustpilot (more platforms are coming). Messages are sent via WhatsApp or email, depending on what you choose in each flow."
  },
  {
    question: "Does FiveUp hide or delete bad reviews?",
    answer: "No. FiveUp never edits or deletes reviews on external platforms. We simply let you collect low-rating feedback in a private space first (WhatsApp or a feedback page), so you can solve issues directly with the customer before inviting them to leave a public review if they wish."
  },
  {
    question: "Is FiveUp only for online stores?",
    answer: "FiveUp is built for brands that care about their reputation, whether you sell online, offline, or both. E-commerce stores, salons, clinics, gyms and local businesses can all use the same flows to grow reviews and protect their image."
  },
  {
    question: "Do I need a developer or an agency to use FiveUp?",
    answer: "No. FiveUp is designed for founders and marketing teams. Setup is guided, there's no code to write, and you can change your flows, messages and rules directly from the dashboard whenever you need."
  }
];

const Faq = () => {
  return (
    <section className="space-y-6 w-full py-16 flex flex-col md:flex-row gap-10">
      <AnimatedSection fromLeft={true} className="w-full md:w-1/2">
        <Badge variant="landing">FAQ</Badge>
        <Typography variant="h2" className="mb-4">Frequently asked questions</Typography>
        <Typography variant="p"> If you don't find your answer here, you can reach us directly at <a href="mailto:info@fiveup-review.com" className={buttonVariants({ variant: "link", className: "pl-0 pr-0" })}>info@fiveup-review.com</a>. Our team will be happy to help you set up FiveUp, connect your tools and get more 5★ reviews.</Typography>
      </AnimatedSection>

      <AnimatedSection fromLeft={false} delay={0.15} className="mb-4 w-full md:w-1/2">
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="mb-4">
              <AccordionTrigger className="font-bold text-md">{item.question}</AccordionTrigger>
              <AccordionContent>
                <Typography variant="description">
                  {item.answer}
                </Typography>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </AnimatedSection>

    </section>
  )
}

export default Faq;
