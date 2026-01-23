import { Card } from "@/components/ui/card";
import Typography from "@/components/ui/typography";
import { BarChart, Settings } from "lucide-react";
import { ComponentProps, ComponentType } from "react";
import { AnimatedBenefitItem } from "./animated-wrapper";
import { LandingBlock } from "./landing-block";

const Google = (props: ComponentProps<"svg">) => {

  return (
    <svg fill="currentColor" width="80" height="80" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" transform="rotate(0 0 0)" {...props} >
      <path d="M21.5939 11.0792H12.3209V13.8256H18.9768C18.6214 17.6382 15.5196 19.286 12.5148 19.286C8.70223 19.286 5.30969 16.3135 5.30969 12.0162C5.30969 7.88057 8.54068 4.74651 12.5148 4.74651C15.5519 4.74651 17.3936 6.71741 17.3936 6.71741L19.2676 4.74651C19.2676 4.74651 16.7474 2.00016 12.3856 2.00016C6.6344 1.96785 2.24023 6.78203 2.24023 11.9839C2.24023 17.0243 6.37592 22 12.4825 22C17.8783 22 21.7554 18.349 21.7554 12.8886C21.7877 11.7578 21.5939 11.0792 21.5939 11.0792Z" className={props.className} />
    </svg>

  );
}

const benefits = [{
  icon: BarChart,
  title: "Trustpilot reviews growth",
  description: "Envoyez des demandes d'avis au bon moment, sans action manuelle, après chaque interaction client."

}, {
  icon: Google,
  iconProps: { width: 24, height: 24 },
  title: "Google rating uplift",
  description: "Les avis positifs sont redirigés vers les plateformes publiques, tandis que les retours négatifs sont centralisés en interne."
}, {
  icon: Settings,

  title: "Sales increase driven by social proof",
  description: "Tous vos avis, règles et automatisations sont regroupés dans une interface claire, personnalisée selon vos objectifs."
}]


type BenefitProps = {
  icon: ComponentType<any>,
  iconProps?: any,
  title: string,
  description: string,
  index: number
}
const Benefit = ({ icon: Icon, iconProps = {}, title, description, index }: BenefitProps) => {
  const isEven = index % 2 !== 0;
  return (
    <div className={`border-dashed-long-left ${isEven ? 'border-dashed-long-right md:border-dashed-long-left' : ''} p-8 pb-0 space-y-8 flex flex-col`}>
      <Card className="w-max p-4 z-20 bg-background/50 backdrop-blur-sm box-shadow-lg">
        <Icon {...iconProps} />
      </Card>

      <Typography variant="h4" className={`relative after:absolute after:content-[''] after:top-0 after:w-1 after:h-[38px] after:bg-primary after:rounded-md ${isEven ? 'after:-right-[34px] md:after:-left-[34px]' : 'after:-left-[34px]'}`}>{title}</Typography>
      <Typography variant="description" className="text-muted-foreground">{description}</Typography>
    </div>
  )
}

const Benefits = () => {
  return (
    <LandingBlock badge="Bénéfices clés" title="More reviews. Higher ratings. More revenue." bg>
      <div className="flex flex-col  md:flex-row gap-8 md:gap-4 ">
        {benefits.map((benefit, index) => (
          <AnimatedBenefitItem key={index} delay={0.2 * index}>
            <Benefit index={index} icon={benefit.icon} iconProps={benefit.iconProps} title={benefit.title} description={benefit.description} />
          </AnimatedBenefitItem>
        ))}
      </div>
    </LandingBlock>
  );
};

export default Benefits;