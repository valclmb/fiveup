import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface StarIconProps {
  className?: string;
  size?: number;
  outline?: boolean;
  strokeWidth?: number;
  color?: string;
  starsCount?: number;
  starsFilled?: number;
}

export const StarIcons = ({ className, size = 20, outline = false, strokeWidth = 2, color = "#ffd230", starsCount = 5, starsFilled = 0 }: StarIconProps) => {
  return <div className="flex gap-1">{Array.from({ length: starsCount }).map((_, index) => (
    <StarIcon key={index} className={className} color={color} size={size} strokeWidth={strokeWidth} outline={starsFilled ? (index < starsFilled ? false : true) : outline} />
  ))}
  </div>
};

export const StarIcon = ({
  className,
  size = 24,
  outline = false,
  strokeWidth = 2,
  color = "#ffd230"
}: StarIconProps) => {
  return <Star size={size} strokeWidth={strokeWidth} strokeOpacity={outline ? 1 : 0} color={color} fill={outline ? "none" : color} className={cn("text-", className)} />
};