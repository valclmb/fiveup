import { Badge } from "@/components/ui/badge";
import Typography from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export interface ContentPageTemplateProps {
  /** Badge text above the title (e.g. "Demo") */
  badge: string;
  /** Main heading - can be plain text or LayoutTextFlip */
  title: React.ReactNode;
  /** Subtitle/description below the title */
  description: string;
  /** Main content (e.g. grid with CallAgenda + CalEmbed) */
  children: React.ReactNode;
  /** Title className for custom styling */
  titleClassName?: string;
  /** Description className */
  descriptionClassName?: string;
  /** Badge variant */
  badgeVariant?: "default" | "secondary" | "outline" | "destructive" | "landing";
}

/**
 * Header + content for content pages. Used with (content-page) layout
 * which provides container + FAQ + CTA.
 * Structure: Badge → Title → Description → Content
 */
export function ContentPageTemplate({
  badge,
  title,
  description,
  children,
  titleClassName,
  descriptionClassName,
  badgeVariant = "landing",
}: ContentPageTemplateProps) {
  return (
    <div className="space-y-32">
      <div className="text-center space-y-8">
        <div className="flex flex-col items-center gap-5 -mt-4">
          <Badge variant={badgeVariant} className="-mt-2">
            {badge}
          </Badge>
          <div className={cn("text-4xl md:text-5xl font-bold", titleClassName)}>
            {title}
          </div>
        </div>
        <Typography
          variant="p"
          affects="lead"
          className={cn(
            "text-muted-foreground max-w-2xl mx-auto text-lg pt-2",
            descriptionClassName
          )}
        >
          {description}
        </Typography>
      </div>

      {children}
    </div>
  );
}
