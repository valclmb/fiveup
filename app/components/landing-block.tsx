import { Badge } from "@/components/ui/badge";
import Typography from "@/components/ui/typography";

type LandingBlockProps = {
  children: React.ReactNode,
  badge: string,
  title: string
}
export const LandingBlock = ({ children, badge,title}: LandingBlockProps) => {
  return (
    <div className="space-y-8">
      <Badge variant="secondary">{badge}</Badge>
      <Typography variant="h2">{title}</Typography>
      {children}
    </div>
  );
};