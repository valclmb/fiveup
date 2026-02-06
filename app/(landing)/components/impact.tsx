import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Typography from "@/components/ui/typography";
import { ChartNoAxesColumnIncreasing, Star, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { AnimatedImpactItem, AnimatedLandingHeader, AnimatedLandingItem } from "./animated-wrapper";
import { StarIcon } from "./star-icon";


const Impact = () => {
  return (
    <section className="space-y-6 w-full py-16">
      <AnimatedLandingHeader>
        <AnimatedLandingItem>
          <Typography variant="h2">Finally understand the real impact <br className="hidden sm:block" />of your reviews</Typography>
        </AnimatedLandingItem>
      </AnimatedLandingHeader>
      <div className="flex flex-col items-center lg:flex-row lg:items-start gap-16">
        <AnimatedImpactItem fromLeft={true} delay={0.1} className="flex justify-center lg:justify-start shrink-0">
          <Image src="/images/impact-illustration.svg" alt="impact-illustration" width={460} height={400} className="w-full max-w-[460px] h-auto" />
        </AnimatedImpactItem>

        <aside className="flex-1 grid grid-cols-[auto_1fr] gap-8 items-start max-w-2xl">
          <AnimatedImpactItem delay={0.2}>
            <Card className="p-4">
              <ChartNoAxesColumnIncreasing size={24} />
            </Card>
          </AnimatedImpactItem>
          <AnimatedImpactItem delay={0.2}>
            <div className="space-y-2">
              <Typography variant="h3">Turn bad reviews into real conversations</Typography>
              <Typography variant="description" className="text-muted-foreground">When someone leaves a low rating, FiveUp lets you start a WhatsApp conversation with them to understand what went wrong, fix it fast, and turn a bad experience into a better relationship.</Typography>
            </div>
          </AnimatedImpactItem>

          <AnimatedImpactItem delay={0.3}>
            <Card className="p-4">
              <ThumbsUp size={24} />
            </Card>
          </AnimatedImpactItem>
          <AnimatedImpactItem delay={0.3}>
            <div className="space-y-2">
              <Typography variant="h3" className="flex flex-wrap items-center gap-2">Find the real reasons behind 1–3<StarIcon className="size-5 md:size-auto" /> reviews</Typography>
              <Typography variant="description" className="text-muted-foreground">Group low ratings by product, carrier or issue so you instantly see what’s broken and fix it before it tanks satisfaction.</Typography>
            </div>
          </AnimatedImpactItem>

          <AnimatedImpactItem delay={0.4}>
            <Card className="p-4">
              <Star size={24} />
            </Card>
          </AnimatedImpactItem>
          <AnimatedImpactItem delay={0.4}>
            <div className="space-y-2">
              <Typography variant="h3">Fix issues once — benefit on every order</Typography>
              <Typography variant="description" className="text-muted-foreground">
                Create simple flows between WhatsApp and your review pages, making it easy for customers to reach you and for your team to manage reputation in one place.

              </Typography>
            </div>
          </AnimatedImpactItem>

          <AnimatedImpactItem delay={0.5} className="col-span-2 md:col-span-1 md:col-start-2">
            <Button variant="landing" className="w-full">Get started now</Button>
          </AnimatedImpactItem>

        </aside>
        {/* <ul className="space-y-12">
            <li className="flex items-start gap-8">
             
            </li>
            <li className="flex items-start gap-8">
              <Card className="p-4">
                <ThumbsUp size={24} />
              </Card>
              <div>
                <Typography variant="h3" className="flex items-center gap-2"> 4 <StarIcon />  → 5 <StarIcon /> average rating uplift</Typography>
                <Typography variant="description" className="text-muted-foreground">Unhappy customers often speak out online, before you've had a chance to intervene.</Typography>
              </div>
            </li>
            <li className="flex items-start gap-8">
              <Card className="p-4">
                <Star size={24} />
              </Card>
              <div>
                <Typography variant="h3">70% of low ratings resolved before going public</Typography>
                <Typography variant="description" className="text-muted-foreground">Reviews are scattered, with no clear tracking, no automation, and no overview to act effectively.</Typography>
              </div>
            </li> */}



        {/* <Button className="w-full">Commencer à récolter des avis maintenant</Button> */}




      </div>
    </section >
  )
}

export default Impact;