import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { AnimatedFadeUp } from "./animated-wrapper";



const Cta = () => {
  return (
    <AnimatedFadeUp className="bg-card relative flex h-82 w-full items-center justify-center overflow-hidden rounded-lg border p-20">
      <AnimatedGridPattern
        width={115}
        height={115}
        x={-1}
        y={-20}
        // strokeDasharray={5}
        numSquares={20}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "mask-[radial-gradient(800px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%]",
          "stroke-muted-foreground/30",
          "text-primary" // Couleur des carrés animés (utilise currentColor)
        )}
      />

      <div className="flex flex-col items-center justify-center text-center">
        <Typography variant="h2" className="text-2xl lg:text-center md:text-[42px] mb-0">Ready to make reviews your unfair advantage?</Typography>
        <Typography variant="description" className="text-sm  md:text-base text-muted-foreground">Plug FiveUp into your stack and turn every customer into social proof – without adding more work to your team.</Typography>
        <Button className="mt-5 z-10 px-8">Commencer maintenant</Button>
      </div>

    </AnimatedFadeUp>
  )
}

export default Cta;