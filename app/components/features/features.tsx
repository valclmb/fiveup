import { Clock, MessageCircle, Settings2, Shield, Star } from "lucide-react";
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
  return (
    <LandingBlock badge="Features" title="Tout pour gérer vos avis, en un seul endroit" >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 w-full">
        {featuresData.map((feature, index) => (
          <FeaturesCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            className={feature.className}
            content={feature.content}
          />
        ))}
      </div>
    </LandingBlock>
  );
};