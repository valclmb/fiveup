import Typography from "@/components/ui/typography";
import {
  Target, BarChart3, ShoppingBag, MessageSquare,
  Zap, Link, MessageCircle, Palette, PieChart,
  DollarSign, Rocket, Handshake, CheckCircle,
  type LucideIcon,
} from "lucide-react";

const SECTIONS = [
  {
    title: "Understand",
    items: [
      { icon: Target, text: "Your business & goals" },
      { icon: BarChart3, text: "Current review strategy" },
      { icon: ShoppingBag, text: "Shopify store analysis" },
      { icon: MessageSquare, text: "Customer feedback challenges" },
    ],
  },
  {
    title: "Discover",
    items: [
      { icon: Zap, text: "FiveUp platform demo" },
      { icon: Link, text: "Automated workflows" },
      { icon: MessageCircle, text: "WhatsApp & Email integration" },
      { icon: Palette, text: "Message customization" },
      { icon: PieChart, text: "Analytics & tracking" },
    ],
  },
  {
    title: "Plan",
    items: [
      { icon: DollarSign, text: "Personalized pricing" },
      { icon: Rocket, text: "Setup & go-live timeline" },
      { icon: Handshake, text: "Onboarding support" },
      { icon: CheckCircle, text: "Next steps & free trial" },
    ],
  },
];

type Item = { icon: LucideIcon; text: string };

function Item({ icon: Icon, text }: Item) {
  return (
    <div className="flex items-start gap-3 group">
      <Icon className="w-5 h-5 shrink-0 mt-0.5 text-primary group-hover:scale-110 transition-transform" />
      <Typography variant="description" className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
        {text}
      </Typography>
    </div>
  );
}

export function CallAgenda() {
  return (
    <div className="rounded-xl border bg-card shadow-sm p-6 space-y-6 h-fit lg:sticky lg:top-6">
      <div className="space-y-2">
        <Typography variant="h3" className="text-xl font-bold">
          What we&apos;ll cover during the call
        </Typography>
        <Typography variant="p" affects="small" className="text-muted-foreground">
          A structured 30-minute conversation to help you get the most value
        </Typography>
      </div>

      <div className="space-y-6">
        {SECTIONS.map((section, i) => (
          <div key={section.title}>
            {i > 0 && <div className="border-t mb-6" />}
            <div className="space-y-3">
              <Typography variant="h4" className="font-semibold text-base uppercase tracking-wide text-muted-foreground">
                {section.title}
              </Typography>
              <div className="space-y-2.5">
                {section.items.map((item, j) => (
                  <Item key={j} {...item} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t">
        <Typography variant="p" affects="small" className="text-muted-foreground text-center">
          💡 Come prepared with any questions about automating your review collection
        </Typography>
      </div>
    </div>
  );
}