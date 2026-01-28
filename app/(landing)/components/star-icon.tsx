import { cn } from "@/lib/utils";

interface StarIconProps {
  className?: string;
  size?: number;
  outline?: boolean;
  strokeWidth?: number;
  color?: string;
  starsCount?: number;
  starsFilled?: number;
}

export const StarIcons = ({ className, size = 20, outline = false, strokeWidth = 2, color = "#23F4BD", starsCount = 5, starsFilled = 0 }: StarIconProps) => {
  return <div className="flex gap-1">{Array.from({ length: starsCount }).map((_, index) => (
    <StarIcon key={index} className={cn("text-amber-300", className)} color={color} size={size} strokeWidth={strokeWidth} outline={starsFilled ? (index < starsFilled ? false : true) : outline} />
  ))}
  </div>
};

export const StarIcon = ({
  className,
  size = 24,
  outline = false,
  strokeWidth = 2,
  color = "#23F4BD"
}: StarIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-[#23F4BD]/90", className)}
      style={{ color: color }}
    >
      <path
        d="M25.9938 0L34.0259 16.2721L51.9876 18.8975L38.9907 31.5565L42.058 49.4402L25.9938 40.9922L9.92964 49.4402L12.9969 31.5565L0 18.8975L17.9617 16.2721L25.9938 0Z"
        fill={outline ? "none" : "currentColor"}
        stroke={outline ? "currentColor" : "none"}
        strokeWidth={outline ? strokeWidth : 0}
      />
    </svg>
  );
};
