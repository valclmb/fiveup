"use client"
import { StarIcon } from "@/app/components/star-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/typography";
import { motion } from "motion/react";
import RatingCards from "./rating-cards";

const Hero = () => {
  return (
    <div className='relative w-full flex flex-col items-center gap-6 mb-28 sm:mb-24 md:mb-32 '>
      <motion.div initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}>
        <Badge variant="secondary">Gestion des avis</Badge>
      </motion.div>
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
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        <Typography variant="p" className="text-center max-w-sm md:max-w-lg mx-auto text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sed mauris a ex posuere luctus sit amet ac mi.</Typography>
      </motion.div>
      <div className="flex flex-col md:flew-row items-center gap-4 mt-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8, ease: "easeOut" }}

        >
          <Button>Commencer maintenant</Button>

        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.9, ease: "easeOut" }}

        >
          <Button variant="secondary">Découvrir les fonctionnalités</Button>

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


      <RatingCards />

    </div>
  )

}
export default Hero;