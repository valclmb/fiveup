import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { StarIcon } from "./star-icon";

interface RatingCardProps {
  platform: "google" | "trustpilot";
  className?: string;
}

const RatingCard = ({ platform,className }: RatingCardProps) => {
const logos= {
  google: {
    path: "/images/google-logo.svg",
    width: 50,
    height: 20,
  },
  trustpilot: {
    path: "/images/trustpilot-logo.svg",
    width: 80,
    height: 20,
  },
}

 
  return (
    <Card className={cn("absolute p-2", className)}>
      <CardContent className="p-0 space-y-2">

        <div className="flex gap-1">
          {Array.from({length: 5}).map((_, index) => (
            <StarIcon key={index} width={20} height={20} className="text-amber-300" />
          ))}
        </div>
      
      
      <Image 
          src={logos[platform].path} 
          alt={`${platform} logo`} 
          width={logos[platform].width} 
          height={logos[platform].height} 
        />   </CardContent>
    </Card>
  );
}

const RatingCards = () => {
  return (
   <>
      <RatingCard platform="trustpilot" className="left-10 top-72" />
      <RatingCard platform="google" className="left-24 bottom-32"  />
      <RatingCard platform="trustpilot" className="-right-10 top-74" />
      <RatingCard platform="google" className="right-24 bottom-42"  />
      </>
  )
}
export default RatingCards;