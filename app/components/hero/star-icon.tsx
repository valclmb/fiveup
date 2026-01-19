import { cn } from "@/lib/utils";

interface StarIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export const StarIcon = ({ className, width = 24, height = 24 }: StarIconProps) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 52 52" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={cn("text-[#23F4BD]/90", className)}
    >
      <path 
        d="M25.9938 0L34.0259 16.2721L51.9876 18.8975L38.9907 31.5565L42.058 49.4402L25.9938 40.9922L9.92964 49.4402L12.9969 31.5565L0 18.8975L17.9617 16.2721L25.9938 0Z" 
        fill="currentColor"
      />
    </svg>
  );
};
