import { cn } from "@/lib/utils"
import { Star } from "lucide-react"
import { Fragment } from "react/jsx-runtime"
import { Pills } from "../custom-ui/pills"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { DotPattern } from "../ui/dot-pattern"
import { Separator } from "../ui/separator"
import Typography from "../ui/typography"
import { LandingBlock } from "./landing-block"

const stats = [{
  value: "4x",
  label: "more public reviews for your online store"
}, {
  value: "92%",
  label: "fewer bad surprises on public review pages"
}, {
  value: "1",
  label: "unified dashboard for all your clients"
}]


const testimonials = [{
  name: "Lounge Owner",
  description: "After each appointment, clients get a quick message. Happy ones go to Google, others talk to us directly. Our rating finally reflects our real work."
},
{
  name: "Marketing Manager",
  description: "FiveUp turned reviews from a stressful chore into a system. The tool is flexible enough for any business and simple enough for the whole team to use."
}, {
  name: "E-Commerce Founder",
  description: "We stopped thinking about reviews. FiveUp just keeps Google and Trustpilot growing in the background while we focus on ads and product."
}]

export const Results = () => {
  return (
    <LandingBlock>
      <LandingBlock.Badge>
        Results
      </LandingBlock.Badge>
      <LandingBlock.Title className="max-w-full">
        Reviews that build trust for you
      </LandingBlock.Title>
      <LandingBlock.Content className="grid grid-cols-3 gap-6 space-y-0 gap-y-18">
        <Card variant="landing" className="relative overflow-hidden ring-transparent rounded-4xl col-span-3">
          <DotPattern
            glow
            width={10}
            height={10}
            opacity={0.7}
            className="[mask-image:radial-gradient(ellipse_70%_80%_at_50%_100%,white,transparent,transparent)]"
          />
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl blur-3xl bg-[radial-gradient(ellipse_35%_80%_at_50%_100%,color-mix(in_oklch,var(--primary)_25%,transparent)_0%,transparent_60%)]"
            aria-hidden
          />
          <CardContent className={cn("flex justify-around text-center p-18 relative",
            "before:content-[''] before:-translate-y-6 before:absolute before:inset-0 before:w-1/2 before:translate-x-1/2 before:h-[0.5px] before:bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.5),transparent)]"
          )}>
            {stats.map((stat, index) => (
              <Fragment key={stat.value}>
                <div className="max-w-43 py-8">
                  <strong className="text-8xl font-medium bg-[linear-gradient(to_bottom_right,var(--primary),#27705D)] bg-clip-text text-transparent">{stat.value}</strong>
                  <Typography variant="p">{stat.label}</Typography>
                </div>
                {index < stats.length - 1 && <Separator orientation="vertical" />}
              </Fragment>
            ))}
          </CardContent>
        </Card>
        {testimonials.map((testimonial) => (
          <Card variant="landing" key={testimonial.name} className="relative overflow-hidden col-span-1 p-7.5">
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl blur-xl bg-[radial-gradient(ellipse_100%_100%_at_50%_0%,color-mix(in_oklch,var(--primary)_25%,transparent)_0%,transparent_60%)]"
              aria-hidden
            />
            <CardHeader className="flex items-center justify-between px-0 z-10">
              <CardTitle>
                <Typography variant="h3" className="text-xl">{testimonial.name}</Typography>
              </CardTitle>
              <Pills>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={14} className="fill-foreground" />
                ))}
              </Pills>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              <Typography variant="p" affects="muted">“ {testimonial.description} ”</Typography>
            </CardContent>
          </Card>
        ))}
      </LandingBlock.Content>
    </LandingBlock>
  )
}