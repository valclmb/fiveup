"use client"
import { StarIcon } from "@/app/(landing)/components/star-icon";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import Typography from "@/components/ui/typography";
import { motion } from "motion/react";
import Link from "next/link";
import RatingCard from "../../../../components/rating-card";

const Hero = () => {
  return (
    <div className='relative w-full flex flex-col items-center gap-10 mb-28 sm:mb-24 md:mb-32 '>
      <motion.div initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}>
        <Badge variant="secondary">Gestion des avis</Badge>
      </motion.div>
      <div className="space-y-2">


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        >
          <Typography variant="h1" className="text-center">
            Transformez chaque client
            <div className="inline ml-2 xs:ml-0 sm:flex items-center justify-center gap-2">en <span className="text-primary">avis 5 </span><StarIcon size={42} className="inline xs:block xs:-translate-y-1 size-5 md:size-auto" /></div>
          </Typography>

        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          <Typography variant="p" className="text-center max-w-sm md:max-w-lg mx-auto text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sed mauris a ex posuere luctus sit amet ac mi.</Typography>
        </motion.div>
      </div>

      <div className="flex flex-col items-center mt-7">

        <div className="flex flex-col lg:flex-row items-center gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8, ease: "easeOut" }}

          >
            <Link href="/auth/signup" className={buttonVariants({ variant: "landing" })}>Commencer maintenant</Link>

          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.9, ease: "easeOut" }}

          >
            <a href="#features" className={buttonVariants({ variant: "secondary" })}>Découvrir les fonctionnalités</a>

          </motion.div>


        </div>

        <Typography variant="p" className="text-sm sm:text-base my-4 md:mt-8 flex gap-2 items-center">
          <motion.span initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 1, ease: "easeOut" }}><StarIcon className="text-background bg-primary p-1 rounded-full" size={24} /></motion.span>
          <motion.span initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.1, ease: "easeOut" }}> Rated <span className="font-bold"> 4.9/5</span> from over <span className="font-bold">600</span> reviews.</motion.span>
        </Typography>
      </div>




      <RatingCard
        platform="trustpilot"
        className="left-0 -bottom-22 sm:top-32 sm:bottom-auto lg:left-4"
        delay={1}
      />
      <RatingCard
        platform="google"
        className="left-40 -bottom-16 sm:bottom-12 sm:left-8 md:left-24"
        delay={1.1}
        floatOffset={1.1}
      />
      {/* Right cards */}
      <RatingCard
        platform="trustpilot"
        className="right-2 -bottom-14 sm:right-12 sm:bottom-18"
        delay={1.2}
        floatOffset={0.9}
      />
      <RatingCard
        platform="google"
        className="-bottom-28 right-34 sm:bottom-auto sm:top-34 sm:right-0"
        delay={1.3}
      />

    </div>
  )

}
export default Hero;