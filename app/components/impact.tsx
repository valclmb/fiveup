import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Typography from "@/components/ui/typography";
import { ChartNoAxesColumnIncreasing, Star, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { StarIcon } from "./star-icon";


const Impact = () => {
  return (
    <section className="space-y-6 w-full py-16">
      <Typography variant="h2">Finally understand the real impact <br />of your reviews</Typography>
      <div className="flex items-start gap-36">
        <Image src="/images/impact-illustration.svg" alt="impact-illustration" width={460} height={400} />

        <aside className="flex-1 grid grid-cols-[auto_1fr] gap-8 items-start">

          <Card className="p-4">
            <ChartNoAxesColumnIncreasing size={24} />
          </Card>
          <div className="space-y-2">
            <Typography variant="h3">100% of reviews are displayed</Typography>
            <Typography variant="description" className="text-muted-foreground">Lorem Ipsum</Typography>
          </div>

          <Card className="p-4">
            <ThumbsUp size={24} />
          </Card>
          <div className="space-y-2">
            <Typography variant="h3" className="flex items-center gap-2"> 4 <StarIcon />  → 5 <StarIcon /> average rating uplift</Typography>
            <Typography variant="description" className="text-muted-foreground">Les clients mécontents s'expriment souvent en ligne, sans que vous ayez eu l'occasion d'intervenir en amont.</Typography>
          </div>

          <Card className="p-4">
            <Star size={24} />
          </Card>
          <div className="space-y-2">
            <Typography variant="h3">70% of low ratings resolved before going public</Typography>
            <Typography variant="description" className="text-muted-foreground">Les avis sont dispersés, sans suivi clair, sans automatisation et sans vision d'ensemble pour agir efficacement.</Typography>
          </div>

          <Button className="col-start-2 w-full">Commencer à récolter des avis maintenant</Button>

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
                <Typography variant="description" className="text-muted-foreground">Les clients mécontents s'expriment souvent en ligne, sans que vous ayez eu l'occasion d'intervenir en amont.</Typography>
              </div>
            </li>
            <li className="flex items-start gap-8">
              <Card className="p-4">
                <Star size={24} />
              </Card>
              <div>
                <Typography variant="h3">70% of low ratings resolved before going public</Typography>
                <Typography variant="description" className="text-muted-foreground">Les avis sont dispersés, sans suivi clair, sans automatisation et sans vision d'ensemble pour agir efficacement.</Typography>
              </div>
            </li> */}



        {/* <Button className="w-full">Commencer à récolter des avis maintenant</Button> */}




      </div>
    </section >
  )
}

export default Impact;