"use client"

import { useIsMobile } from "@/hooks/use-mobile";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const VideoPreviewMobile = () => {
  return (
    <div className="relative w-full md:w-2/3 mx-auto md:mt-0 space-y-8 md:space-y-16 pt-24 px-4 md:px-0">
      <div className="w-full relative">
        <video
          src="/postcss.config.mp4"
          autoPlay
          muted
          loop
          className="mx-auto rounded-lg shadow-[20px_20px_60px_0px] md:shadow-[40px_40px_120px_0px] shadow-tertiary w-full h-auto"
        />

        <div className="flex flex-wrap justify-center md:justify-between gap-4 md:gap-0 mt-8 w-full">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="flex-shrink-0">
              <Image
                src="/images/partner-logo.svg"
                alt="partner-logo"
                width={150}
                height={40}
                className="w-24 h-6 md:w-[150px] md:h-10"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const VideoPreviewDesktop = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [initialAnimationDone, setInitialAnimationDone] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Marquer l'animation initiale comme terminée après le delay + duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialAnimationDone(true);
    }, 1300); // 1000ms delay + 300ms duration
    return () => clearTimeout(timer);
  }, []);

  // Scale : commence à 1, s'agrandit au milieu, puis rapetisse à la fin
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.6, 1], [1, 1.3, 1.2, 0.8]);

  // Y position : commence en haut pour voir le haut, puis se centre au milieu
  // Ne s'applique qu'après l'animation initiale
  const scrollY = useTransform(scrollYProgress, [0, 0.2, 0.6, 1], [-250, 0, 0, 0]);
  const y = initialAnimationDone ? scrollY : undefined;

  // Animation des logos : apparaissent plus tôt dans le scroll
  // Chaque logo a un délai progressif
  const getLogoAnimation = (index: number) => {
    const start = 0.2 + (index * 0.05); // Délai progressif pour chaque logo
    const end = 0.3 + (index * 0.1);
    return {
      opacity: useTransform(scrollYProgress, [start, end], [0, 1]),
      y: useTransform(scrollYProgress, [-10, 0], [50, 0]),
      scale: useTransform(scrollYProgress, [start, end], [0.8, 1])
    };
  };

  return (
    <div
      ref={containerRef}
      className="relative md:w-2/3 mx-auto md:mt-0 space-y-8 md:space-y-16 h-[300vh]"
    >
      <div className="sticky top-0 flex items-center justify-center h-screen">
        <motion.div
          initial={{ opacity: 0, y: 250 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.3 }}
          style={{ scale, y }}
          className="w-full relative"
        >
          <video
            src="/postcss.config.mp4"
            autoPlay
            muted
            loop
            className="mx-auto rounded-lg shadow-[40px_40px_120px_0px] shadow-tertiary w-full"
          />

          <motion.div className="flex flew-wrap justify-between mt-8 w-full">
            {[0, 1, 2, 3].map((index) => {
              const logoAnim = getLogoAnimation(index);
              return (
                <motion.div
                  key={index}
                  style={{
                    opacity: logoAnim.opacity,
                    y: logoAnim.y,
                    scale: logoAnim.scale
                  }}
                >
                  <Image
                    src="/images/partner-logo.svg"
                    alt="partner-logo"
                    width={150}
                    height={40}
                    className="size-18 md:size-auto"
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export const VideoPreview = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <VideoPreviewMobile />;
  }

  return <VideoPreviewDesktop />;
};
