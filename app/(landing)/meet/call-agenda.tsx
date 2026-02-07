import { 
    Target, 
    BarChart3, 
    ShoppingBag, 
    MessageSquare,
    Zap,
    Link,
    MessageCircle,
    Palette,
    PieChart,
    DollarSign,
    Rocket,
    Handshake,
    CheckCircle
} from "lucide-react";
import Typography from "@/components/ui/typography";
  
  type AgendaItemProps = {
    icon: React.ReactNode;
    text: string;
  };
  
  function AgendaItem({ icon, text }: AgendaItemProps) {
    return (
      <div className="flex items-start gap-3 group">
        <div className="shrink-0 w-5 h-5 mt-0.5 text-primary group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <Typography variant="description" className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
          {text}
        </Typography>
      </div>
    );
  }
  
  type AgendaSectionProps = {
    title: string;
    items: { icon: React.ReactNode; text: string }[];
  };
  
  function AgendaSection({ title, items }: AgendaSectionProps) {
    return (
      <div className="space-y-3">
        <Typography variant="h4" className="font-semibold text-base uppercase tracking-wide text-muted-foreground">
          {title}
        </Typography>
        <div className="space-y-2.5">
          {items.map((item, index) => (
            <AgendaItem key={index} icon={item.icon} text={item.text} />
          ))}
        </div>
      </div>
    );
  }
  
  export function CallAgenda() {
    const understandItems = [
      { icon: <Target className="w-5 h-5" />, text: "Your business & goals" },
      { icon: <BarChart3 className="w-5 h-5" />, text: "Current review strategy" },
      { icon: <ShoppingBag className="w-5 h-5" />, text: "Shopify store analysis" },
      { icon: <MessageSquare className="w-5 h-5" />, text: "Customer feedback challenges" },
    ];
  
    const discoverItems = [
      { icon: <Zap className="w-5 h-5" />, text: "FiveUp platform demo" },
      { icon: <Link className="w-5 h-5" />, text: "Automated workflows" },
      { icon: <MessageCircle className="w-5 h-5" />, text: "WhatsApp & Email integration" },
      { icon: <Palette className="w-5 h-5" />, text: "Message customization" },
      { icon: <PieChart className="w-5 h-5" />, text: "Analytics & tracking" },
    ];
  
    const planItems = [
      { icon: <DollarSign className="w-5 h-5" />, text: "Personalized pricing" },
      { icon: <Rocket className="w-5 h-5" />, text: "Setup & go-live timeline" },
      { icon: <Handshake className="w-5 h-5" />, text: "Onboarding support" },
      { icon: <CheckCircle className="w-5 h-5" />, text: "Next steps & free trial" },
    ];
  
    return (
      <div className="rounded-xl border bg-card shadow-sm p-6 space-y-6 h-fit sticky top-6">
        <div className="space-y-2">
          <Typography variant="h3" className="text-xl font-bold">
            What we&apos;ll cover during the call
          </Typography>
          <Typography variant="p" affects="small" className="text-muted-foreground">
            A structured 30-minute conversation to help you get the most value
          </Typography>
        </div>
  
        <div className="space-y-6">
          <AgendaSection title="Understand" items={understandItems} />
          <div className="border-t" />
          <AgendaSection title="Discover" items={discoverItems} />
          <div className="border-t" />
          <AgendaSection title="Plan" items={planItems} />
        </div>
  
        <div className="pt-4 border-t">
          <Typography variant="p" affects="small" className="text-muted-foreground text-center">
            💡 Come prepared with any questions about automating your review collection
          </Typography>
        </div>
      </div>
    );
  }