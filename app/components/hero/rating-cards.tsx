"use client"
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Image from "next/image";
import { StarIcons } from "../star-icon";

interface RatingCardProps {
  platform: "google" | "trustpilot";
  className?: string;
  delay?: number;
}

const RatingCard = ({ platform, className, delay }: RatingCardProps) => {
  const logos = {
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
      className={cn("absolute ", className)}
    >
      <Card className={cn("p-2 bg-background/60 backdrop-blur-md rounded-xl shadow-2xl shadow-black")}>
        <CardContent className="p-0 space-y-2 ">

          <div className="flex gap-1">
            <StarIcons size={20} className="size-4 lg:size-auto" />
          </div>


          <Image
            src={logos[platform].path}
            alt={`${platform} logo`}
            width={logos[platform].width}
            height={logos[platform].height}
          />   </CardContent>
      </Card>
    </motion.div>
  );
}

const RatingCards = () => {
  return (
    <>
      {/* Left cards */}
      <RatingCard
        platform="trustpilot"
        className="left-0 -bottom-22 sm:top-32 sm:bottom-auto lg:left-4"
        delay={1}
      />
      <RatingCard
        platform="google"
        className="left-40 -bottom-16 sm:bottom-12 sm:left-8 md:left-24"
        delay={1.1}
      />
      {/* Right cards */}
      <RatingCard
        platform="trustpilot"
        className="right-2 -bottom-14 sm:right-12 sm:bottom-18"
        delay={1.2}
      />
      <RatingCard
        platform="google"
        className="-bottom-28 right-34 sm:bottom-auto sm:top-34 sm:right-0"
        delay={1.3}
      />
    </>
  )
}
export default RatingCards;