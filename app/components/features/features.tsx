"use client"
import { Clock, MessageCircle, Settings2, Shield, Star } from "lucide-react";
import { motion, Transition } from "motion/react";
import { LandingBlock } from "../landing-block";
import FeaturesCard from "./features-card";
import { AutomaticConnection, AutoReply, Connect, CustomFlows, ProtectReputation } from "./features-card-contents";

type FeaturesCardData = {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  content?: React.ReactNode;
}

const featuresData: FeaturesCardData[] = [
  {
    icon: <Clock />,
    title: "10-minute setup, then it runs itself",
    description: "Connect your store, choose when to send requests, and you're done.FiveUp pulls orders automatically and starts collecting reviews.",
    className: "md:col-span-2 lg:col-span-6",
    content: <Connect />,
  },
  {
    icon: <Star />,
    title: "Automatic Trustpilot & Google Business",
    description: "No account? We create and connect everything for you from day one.",
    className: "md:col-span-1 lg:col-span-6 ",
    content: <AutomaticConnection />,
  },
  {
    icon: <MessageCircle />,
    title: "Smart auto-replies & follow-ups",
    description: "Set reply templates once. FiveUp handles replies and follow-ups automatically.",
    className: "md:col-span-1 lg:col-span-4",
    content: <AutoReply />,
  },
  {
    icon: <Shield />,
    title: "Protect your reputation",
    description: "Low ratings are routed to private support before they hit public pages.",
    className: "md:col-span-1 lg:col-span-4",
    content: <ProtectReputation />,
  },
  {
    icon: <Settings2 />,
    title: "Fully custom flows",
    description: "Decide what happens after every order.No dev required. Everything is editable.",
    className: "md:col-span-1 lg:col-span-4",
    content: <CustomFlows />,
  },
];

export const Features = () => {
  // Fonction pour déterminer l'animation selon l'index
  const getAnimation = (index: number) => {
    // Les 2 premières cartes (ligne du haut) : une de gauche, une de droite
    if (index === 0) {
      return {
        initial: { opacity: 0, x: -100, scale: 0.9 },
        whileInView: { opacity: 1, x: 0, scale: 1 },
        transition: { duration: 0.6, ease: "easeOut" }
      };
    }
    if (index === 1) {
      return {
        initial: { opacity: 0, x: 100, scale: 0.9 },
        whileInView: { opacity: 1, x: 0, scale: 1 },
        transition: { duration: 0.6, ease: "easeOut" }
      };
    }
    // Les 3 dernières cartes (ligne du bas) : vague de gauche à droite depuis le bas
    return {
      initial: { opacity: 0, y: 50, scale: 0.9 },
      whileInView: { opacity: 1, y: 0, scale: 1 },
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: (index - 2) * 0.15 // Délai progressif pour l'effet vague
      }
    };
  };

  return (
    <LandingBlock badge="Features" title="Tout pour gérer vos avis, en un seul endroit" >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 w-full items-stretch">
        {featuresData.map((feature, index) => {
          const animation = getAnimation(index);
          return (
            <motion.div
              key={index}
              className={`h-full ${feature.className}`}
              initial={animation.initial}
              whileInView={animation.whileInView}
              viewport={{ once: false, margin: "-50px" }}
              transition={animation.transition as Transition<any>}
            >
              <FeaturesCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                content={feature.content}
              />
            </motion.div>
          );
        })}
      </div>
    </LandingBlock>
  );
};