import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Typography from "@/components/ui/typography";

type FeaturesCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  content?: React.ReactNode;
}
const FeaturesCard = ({ icon, title, description, className, content }: FeaturesCardProps) => {
  return (
    <Card className={`flex flex-col h-full ${className || ""}`}>
      <CardHeader className="flex items-center gap-2">
        <CardTitle className="flex items-center gap-3">
          <div className="bg-accent rounded-xl p-3">{icon}</div>
          {title && <Typography variant="h4">{title}</Typography>}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col flex-grow space-y-4">
        {content && <div className="flex-grow">{content}</div>}
        {description && <Typography variant="description" className="mt-auto">{description}</Typography>}
      </CardContent>
    </Card>
  )
}

export default FeaturesCard;
