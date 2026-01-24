"use client"
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Image from "next/image";
import { StarIcons } from "../app/(landing)/components/star-icon";

interface RatingCardProps {
  platform: "google" | "trustpilot";
  className?: string;
  delay?: number;
  floatOffset?: number;
  whiteMode?: boolean;
}

const RatingCard = ({ platform, className = "", delay, floatOffset = 0, whiteMode = false }: RatingCardProps) => {
  const logos = {
    google: {
      path: { white: "/images/google-logo.svg", dark: "/images/google-logo.svg" },
      width: 50,
      height: 20,
    },
    trustpilot: {
      path: { white: "/images/trustpilot-logo-dark.svg", dark: "/images/trustpilot-logo.svg" },
      width: 80,
      height: 20,
    },
  }


  // Pour les cartes avec floatOffset, on inverse la séquence pour créer l'opposition de phase
  const ySequence = floatOffset > 0 ? [-8, 0, -8] : [0, -8, 0];
  const initialY = floatOffset > 0 ? -8 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: 1,
        scale: [0.5, 1.2, 1]
      }}
      transition={{
        duration: 0.5,
        delay: delay || 0,
        ease: "easeOut",
        scale: {
          times: [0, 0.6, 1],
          duration: 0.5,
          delay: delay || 0,
          ease: "easeOut"
        }
      }}
      className={cn("absolute z-40", className)}
    >
      <motion.div
        initial={{ y: initialY }}
        animate={{
          y: ySequence
        }}
        transition={{
          duration: 3,
          delay: delay || 0,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      >
        <Card className={cn("p-2 backdrop-blur-md rounded-xl shadow-2xl ", whiteMode ? "bg-white/90 border border-white/80" : "bg-background/60 shadow-black")}>
          <CardContent className="p-0 space-y-2 ">

            <div className="flex gap-1">
              <StarIcons size={20} className={cn("size-4 lg:size-auto", whiteMode ? "text-amber-400" : "")} />
            </div>


            <Image
              src={logos[platform].path[whiteMode ? "white" : "dark"]}
              alt={`${platform} logo ${whiteMode ? "white" : "dark"}`}
              width={logos[platform].width}
              height={logos[platform].height}
            />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default RatingCard;