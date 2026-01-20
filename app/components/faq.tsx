import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import Typography from "@/components/ui/typography";

const Faq = () => {
  return (
    <section className="space-y-6 w-full py-16 flex gap-10">
      <div className="w-1/2">
        <Badge variant="secondary">FAQ</Badge>
        <Typography variant="h2" className="mb-4">Question fréquemments posées</Typography>
        <Typography variant="p">Avant FiveUp, on subissait les avis. Aujourd’hui, tout est automatisé : les clients satisfaits laissent des avis publics, les autres nous contactent en privé. Notre note Google a clairement progressé.</Typography>
      </div>

      <Accordion type="single" collapsible className="mb-4 w-1/2">
        {Array.from({ length: 5 }).map((_, index) => (

          <AccordionItem key={index} value={`item-${index}`} className="mb-4">
            <AccordionTrigger className="font-bold text-md">Titre de la question ici</AccordionTrigger>
            <AccordionContent>
              <Typography variant="description">
                Use Jambo for analysing and engaging with customer feedback, unlocking valuable insights, and revealing new releases.
              </Typography>
              <Typography variant="description">
                Lorem ipsum aliquam vel justo fringillas enigma.
              </Typography>
            </AccordionContent>
          </AccordionItem>

        ))}

      </Accordion>

    </section>
  )
}

export default Faq;