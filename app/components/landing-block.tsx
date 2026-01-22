import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { Badge } from "@/components/ui/badge";
import Typography from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { AnimatedLandingHeader, AnimatedLandingItem } from "./animated-wrapper";

type LandingBlockProps = {
  children: React.ReactNode,
  badge: string,
  title: string,
  bg?: boolean
}
export const LandingBlock = ({ children, badge, title, bg = false }: LandingBlockProps) => {
  return (
    <div className="w-full  relative py-10 ">

      {bg && <AnimatedGridPattern
        width={112}
        height={112}
        x={-5}
        y={20}
        numSquares={20}
        maxOpacity={0.1}
        duration={2}
        repeatDelay={0.5}
        className={cn(
          // Fade radial pour masquer les bords (inclut le préfixe WebKit)
          "mask-[radial-gradient(ellipse_700px_260px_at_50%_40%,white_55%,transparent_85%)]",
          "[-webkit-mask-image:radial-gradient(ellipse_700px_260px_at_50%_40%,white_55%,transparent_85%)]",
          "inset-x-0 inset-y-[-30%] h-[200%]",
          "stroke-muted-foreground/30",
          "text-primary" // Couleur des carrés animés (utilise currentColor)
        )}
      />}

      <AnimatedLandingHeader>
        <AnimatedLandingItem>
          <Badge variant="secondary">{badge}</Badge>
        </AnimatedLandingItem>
        <AnimatedLandingItem>
          <Typography variant="h2">{title}</Typography>
        </AnimatedLandingItem>
      </AnimatedLandingHeader>
      {children}
    </div>
  );
};