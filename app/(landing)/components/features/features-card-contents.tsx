import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ArrowRight, Check, CirclePlus, Star } from "lucide-react"
import { motion, useInView } from "motion/react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { StarIcon, StarIcons } from "../star-icon"

// Hook personnalisé pour gérer les animations avec hover
const useAnimationOnHover = (animationDuration: number) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });
  const [isHovered, setIsHovered] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleMouseEnter = () => {
    if (!isAnimating) {
      setIsHovered(true);
      setAnimationKey(prev => prev + 1);
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, animationDuration * 1000);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Démarrer l'animation au premier affichage
  useEffect(() => {
    if (isInView && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, animationDuration * 1000);
    }
  }, [isInView, animationDuration]);

  const shouldAnimate = isInView || isHovered;

  return {
    containerRef,
    shouldAnimate,
    animationKey,
    handleMouseEnter,
    handleMouseLeave
  };
};

export const Connect = () => {
  // Calcul du délai pour l'animation de complétion
  // Le dernier checkmark apparaît à 1.8s (0.3 + 1.5) et son animation prend 0.5s
  const completionDelay = 0.3 + 1.5 + 0.5; // delay barre + durée barre + durée animation dernier cercle
  // Durée totale de l'animation (jusqu'à la fin du dernier checkmark)
  const animationDuration = completionDelay;

  const {
    containerRef,
    shouldAnimate,
    animationKey,
    handleMouseEnter,
    handleMouseLeave
  } = useAnimationOnHover(animationDuration);

  const [showCompletion, setShowCompletion] = useState(false);

  // Reset l'animation de complétion au hover
  const handleMouseEnterWithReset = () => {
    handleMouseEnter();
    setShowCompletion(false);
  };

  // Déclencher l'animation de complétion après le délai
  useEffect(() => {
    if (shouldAnimate) {
      const timer = setTimeout(() => {
        setShowCompletion(true);
      }, completionDelay * 1000);
      return () => clearTimeout(timer);
    } else {
      setShowCompletion(false);
    }
  }, [shouldAnimate, animationKey, completionDelay]);

  return (
    <div
      ref={containerRef}
      className="relative bg-accent rounded-xl p-4 cursor-pointer"
      onMouseEnter={handleMouseEnterWithReset}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative flex items-center justify-between">
        {/* Ligne de progression de base (gris) */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-muted z-0"></div>

        {/* Ligne de progression verte animée - s'arrête au 4ème cercle */}
        <motion.div
          key={`progress-${animationKey}`}
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary z-0"
          initial={{ width: "0%" }}
          animate={shouldAnimate ? { width: "100%" } : { width: "0%" }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
        />

        {/* 4 cercles avec checkmarks */}
        {Array.from({ length: 4 }).map((_, index) => {
          const isFirst = index === 0;
          const isLast = index === 3;
          // Calcul du délai pour chaque cercle basé sur la position de la barre
          // La barre prend 1.2s avec un delay de 0.3s
          // Avec justify-between, les cercles sont espacés de manière égale à 0%, 33.33%, 66.66%, 100%
          const progressBarDuration = 1.5;
          const progressBarDelay = 0.3;
          // Position relative de chaque cercle : index / 3 (0, 0.33, 0.66, 1)
          // Le délai = delay de la barre + (durée de la barre * position relative)
          const circleDelay = isFirst ? 0 : progressBarDelay + (progressBarDuration * (index / 3));

          return (
            <motion.div
              key={`circle-${index}-${animationKey}`}
              className="relative z-10 bg-primary rounded-full p-2 flex items-center justify-center"
              initial={{
                opacity: isFirst ? 1 : 0,
                scale: isFirst ? 1 : 0.5,
                rotate: isLast ? 0 : 0
              }}
              animate={shouldAnimate ? {
                opacity: 1,
                scale: isFirst ? 1 : [0.5, 1.4, 1.1, 1],
                rotate: isLast ? [0, 720] : 0
              } : {
                opacity: isFirst ? 1 : 0,
                scale: isFirst ? 1 : 0.5,
                rotate: 0
              }}
              transition={isFirst ? {} : {
                scale: {
                  times: [0, 0.5, 0.75, 1],
                  duration: 0.5,
                  delay: circleDelay,
                  ease: "easeOut"
                },
                rotate: isLast ? {
                  duration: 0.5,
                  delay: circleDelay,
                  ease: "easeOut"
                } : {},
                opacity: {
                  duration: 0.2,
                  delay: circleDelay
                }
              }}
            >
              <Check className="text-primary-foreground" width={16} height={16} strokeWidth={3} />
            </motion.div>
          );
        })}
      </div>
    </div>
  )
}

export const AutomaticConnection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  return (
    <div ref={containerRef} className="flex items-center flex-col lg:flex-row gap-4 ">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        className="w-full"
      >
        <Card className="bg-accent p-0 w-full">
          <CardContent className="flex items-center justify-between gap-2  p-4">
            <Image src="/images/shopify-logo.svg" alt="Trustpilot" width={80} height={30} />
            <Badge variant="secondary" className="lg:hidden rounded-md flex items-center gap-2">
              <div className=" size-2 bg-primary rounded-full after:content-[''] after:absolute after:size-2 after:bg-primary after:rounded-full after:animate-ping  after:duration-[3s] " />

              Connecté
            </Badge>
            <div className="hidden lg:block size-3 bg-primary rounded-full after:content-[''] after:absolute after:size-3 after:bg-primary after:rounded-full after:animate-ping  after:duration-[3s] " />



          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
        className="w-full"
      >
        <Card className="bg-accent p-0 w-full">
          <CardContent className="flex items-center justify-between gap-2  p-4">
            <Image src="/images/trustpilot-logo.svg" alt="Trustpilot" width={85} height={30} />
            <Badge variant="secondary" className="lg:hidden rounded-md flex items-center gap-2">
              <div className=" size-2 bg-primary rounded-full after:content-[''] after:absolute after:size-2 after:bg-primary after:rounded-full after:animate-ping  after:duration-[3s] " />

              Connecté
            </Badge>
            <div className="hidden lg:block size-3 bg-primary rounded-full after:content-[''] after:absolute after:size-3 after:bg-primary after:rounded-full after:animate-ping  after:duration-[3s] " />



          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.7, ease: "easeOut" }}
        className="w-full"
      >
        <Card className="bg-accent  p-0 w-full">
          <CardContent className="flex items-center justify-between p-4">
            <Image src="/images/google-logo.svg" alt="Google Business" width={60} height={30} />
            {/* <Badge variant="secondary" className=" rounded-md">
              <div className="size-2 bg-primary rounded-full"></div>
              Connecté
            </Badge> */}
            <CirclePlus className="text-muted-foreground size-5" />
          </CardContent>
        </Card>
      </motion.div>

    </div >
  )
}

export const AutoReply = () => {
  // Durée totale de l'animation : delay du dernier message (0.5s) + durée (0.3s) = 0.8s
  const animationDuration = 0.9 + 0.5;

  const {
    containerRef,
    shouldAnimate,
    animationKey,
    handleMouseEnter,
    handleMouseLeave
  } = useAnimationOnHover(animationDuration);

  return (
    <div
      ref={containerRef}
      className="space-y-3 bg-accent rounded-xl p-3 cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* message incoming */}
      <motion.div
        key={`incoming-${animationKey}`}
        className="flex justify-start"
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        animate={shouldAnimate ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.9 }}
        transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
      >
        <div className="flex justify-between bg-card rounded-2xl rounded-bl-xs px-3 py-2 gap-2 flex-col sm:gap-4 sm:flex-row items-start sm:items-center max-w-[80%]">
          <p className="text-white">Amazing service</p>
          <div className="flex gap-1">
            <StarIcons className="size-4 xl:size-auto" />
          </div>
        </div>
      </motion.div>
      {/*  message outgoing */}
      <motion.div
        key={`outgoing-${animationKey}`}
        className="flex justify-end"
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        animate={shouldAnimate ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.9 }}
        transition={{ duration: 0.3, delay: 0.5, ease: "easeOut" }}
      >
        <div className="bg-primary  rounded-2xl rounded-br-xs px-3 py-2 gap-2 max-w-[80%] flex flex-col sm:gap-4 sm:flex-row items-end sm:items-center ">
          <p className="text-primary-foreground">Glad to hear that!</p>
          <Badge variant="default" className="bg-white">
            Auto Reply
          </Badge>
        </div>
      </motion.div>
    </div>
  )
}

export const ProtectReputation = () => {
  // Durée totale de l'animation : delay de la flèche (0.6s) + durée (1.8s) = 2.4s
  const animationDuration = 0.6 + 1.8;

  const {
    containerRef,
    shouldAnimate,
    animationKey,
    handleMouseEnter,
    handleMouseLeave
  } = useAnimationOnHover(animationDuration);

  return (
    <div
      ref={containerRef}
      className="relative bg-accent rounded-xl px-4 py-8 cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative flex items-center justify-between">
        {/* Dashed line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px border-t border-dashed border-muted-foreground z-0"></div>

        {/* 1st element with red bubble and star */}
        <motion.div
          key={`bubble-${animationKey}`}
          className="relative z-10 bg-destructive rounded-lg px-3 py-2 flex items-center gap-1 shadow-lg"
          initial={{ rotate: 0 }}
          animate={shouldAnimate ? {
            rotate: [0, -15, 0]
          } : { rotate: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.2,
            ease: "easeInOut"
          }}
        >
          <span className="text-white font-semibold">1</span>
          <Star className="fill-white" size={16} />
          {/* Triangle pointing down */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-8 border-l-transparent border-r-transparent border-t-destructive"></div>
        </motion.div>

        {/* 2nd element with arrow in the center */}
        <motion.div
          key={`arrow-${animationKey}`}
          className="relative z-10 bg-card rounded-lg p-2 flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
          initial={{ opacity: 0, x: -50, rotateY: 0, scale: 1 }}
          animate={shouldAnimate ? {
            opacity: [0, 1, 1, 1],
            x: [-50, 50, 50, 0],
            rotateY: [0, 0, 720, 0],
            scale: [0.5, 1, 1.3, 1] // Prend de la hauteur pendant la virevolte
          } : { opacity: 0, x: -50, rotateY: 0, scale: 1 }}
          transition={{
            opacity: {
              times: [0, 0.2, 0.7, 1],
              duration: 0.6,
              delay: 0.6,
              ease: "easeIn"
            },
            x: {
              times: [0, 0.25, 0.25, 0.6],
              duration: 1.5,
              delay: 0.6,
              ease: [0.4, 0, 0.4, 0.5] // Ralenti pendant le mouvement vers le centre
            },
            rotateY: {
              times: [0, 0.25, 0.6, 0.6],
              duration: 1.5,
              delay: 0.6,
              ease: [0.4, 0, 0.2, 1] // Ralenti au milieu (en l'air)
            },
            scale: {
              times: [0, 0.25, 0.55, 1],
              duration: 1.5,
              delay: 0.6,
              ease: [0.4, 0, 0.2, 1] // Ralenti au milieu (en l'air)
            }
          }}
        >
          <ArrowRight size={20} />
        </motion.div>

        {/* 3rd element with private support */}
        <motion.div
          key={`support-${animationKey}`}
          className="relative z-10 bg-card rounded-lg p-3 flex items-center gap-2 "
          style={{ transformOrigin: "50% 0%" }}
          initial={{ x: 0, scaleX: 1 }}
          animate={shouldAnimate ? {
            x: [0, 8, -3, 0],
            scaleX: [1, 0.95, 1.03, 1]
          } : { x: 0, scaleX: 1 }}
          transition={{
            x: {
              times: [0, 0.2, 0.5, 1],
              duration: 0.4,
              delay: 1,
              ease: "easeOut"
            },
            scaleX: {
              times: [0, 0.2, 0.5, 1],
              duration: 0.4,
              delay: 1,
              ease: "easeOut"
            }
          }}
        >
          <StarIcon className="" size={18} color="var(--color-primary)" />
          <span className="text-white text-sm hidden xl:inline">Trustpilot</span>
        </motion.div>
      </div>
    </div>
  )
}

export const CustomFlows = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  // Configuration pour la première ligne
  const firstLineSwitchAppearDelay = 0.2; // Switch apparaît (opacité)
  const firstLineSwitchToggleDelay = 0.8; // Switch passe de false à true (plus lent)
  const firstLineStarsDelay = 1.1; // Étoiles commencent après le switch (0.8 + 0.3 de marge)
  const firstLineLogoDelay = 1.8; // Logo après les étoiles (1.1 + 0.4 + 0.3)
  const firstLineLogoDuration = 0.3;
  const firstLineDuration = firstLineLogoDelay + firstLineLogoDuration; // 2.1s

  // Configuration pour la deuxième ligne (commence après la première)
  const secondLineStartDelay = firstLineDuration; // 1.1s
  const secondLineLogoDelay = secondLineStartDelay + 0.5 + (4 * 0.1);
  const secondLineLogoDuration = 0.3;
  const secondLineDuration = secondLineLogoDelay + secondLineLogoDuration;

  // Hooks séparés pour chaque ligne
  const {
    shouldAnimate: shouldAnimateLine1,
    animationKey: key1,
    handleMouseEnter: handleMouseEnterLine1,
    handleMouseLeave: handleMouseLeaveLine1
  } = useAnimationOnHover(firstLineDuration);

  const {
    shouldAnimate: shouldAnimateLine2,
    animationKey: key2,
    handleMouseEnter: handleMouseEnterLine2,
    handleMouseLeave: handleMouseLeaveLine2
  } = useAnimationOnHover(secondLineDuration);

  const [switchChecked, setSwitchChecked] = useState(false);
  const previousKey1 = useRef(0);
  const hasAnimated = useRef(false);

  // Animer le switch de la première ligne seulement lors d'une nouvelle animation
  useEffect(() => {
    // Seulement si c'est une nouvelle animation (key1 a changé) ou premier affichage
    if ((key1 !== previousKey1.current) || (isInView && !hasAnimated.current)) {
      previousKey1.current = key1;
      hasAnimated.current = true;
      setSwitchChecked(false);
      const timer = setTimeout(() => {
        setSwitchChecked(true);
      }, firstLineSwitchToggleDelay * 1000);
      return () => clearTimeout(timer);
    }
  }, [key1, isInView, firstLineSwitchToggleDelay]);

  return (
    <div ref={containerRef} className="space-y-4">
      {/* Ligne 1 : Switch ON avec 5 étoiles */}
      <div
        className="w-full flex items-center justify-between gap-3 bg-accent rounded-lg p-4 cursor-pointer"
        onMouseEnter={handleMouseEnterLine1}
        onMouseLeave={handleMouseLeaveLine1}
      >
        <motion.div
          key={`switch-${key1}`}
          initial={{ opacity: 0 }}
          animate={(shouldAnimateLine1 || isInView) ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: firstLineSwitchAppearDelay }}
        >
          <Switch checked={switchChecked} transitionDuration={0.7} />
        </motion.div>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <motion.div
              key={`star-${index}-${key1}`}
              initial={{ opacity: 0, y: -10, scale: 0.5 }}
              animate={(shouldAnimateLine1 || isInView) ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -10, scale: 0.5 }}
              transition={{
                duration: 0.3,
                delay: firstLineStarsDelay + (index * 0.1), // Vague depuis le haut après le switch
                ease: "easeOut"
              }}
            >
              <StarIcon className="text-amber-300 size-4 xl:size-auto" size={20} />
            </motion.div>
          ))}
        </div>
        <motion.div
          key={`logo-${key1}`}
          initial={{ opacity: 0, x: 10 }}
          animate={(shouldAnimateLine1 || isInView) ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
          transition={{
            duration: 0.3,
            delay: firstLineLogoDelay, // Après les étoiles
            ease: "easeOut"
          }}
          className="w-22"

        >
          <Image src="/images/trustpilot-logo.svg" alt="Trustpilot" width={80} height={30} />
        </motion.div>
      </div>

      {/* Ligne 2 : Switch OFF avec 4 étoiles */}
      <div
        className="flex items-center justify-between gap-3 bg-accent rounded-lg p-4 cursor-pointer"
        onMouseEnter={handleMouseEnterLine2}
        onMouseLeave={handleMouseLeaveLine2}
      >
        <motion.div
          key={`switch2-${key2}`}
          initial={{ opacity: 0 }}
          animate={(shouldAnimateLine2 || isInView) ? { opacity: 1 } : { opacity: 0 }}
          transition={{
            duration: 1,
            delay: shouldAnimateLine2 ? 0 : secondLineStartDelay
          }}
        >
          <Switch checked={false} />
        </motion.div>
        <div className="flex gap-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <motion.div
              key={`star2-${index}-${key2}`}
              initial={{ opacity: 0, y: -10, scale: 0.5 }}
              animate={(shouldAnimateLine2 || isInView) ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -10, scale: 0.5 }}
              transition={{
                duration: 0.3,
                delay: shouldAnimateLine2 ? (index * 0.1) : (secondLineStartDelay + (index * 0.1)),
                ease: "easeOut"
              }}
            >
              <StarIcon className="text-amber-300 size-4 xl:size-auto" size={20} />
            </motion.div>
          ))}
          <motion.div
            key={`star-outline-${key2}`}
            initial={{ opacity: 0, y: -10, scale: 0.5 }}
            animate={(shouldAnimateLine2 || isInView) ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -10, scale: 0.5 }}
            transition={{
              duration: 0.3,
              delay: shouldAnimateLine2 ? (4 * 0.1) : (secondLineStartDelay + (4 * 0.1)),
              ease: "easeOut"
            }}
          >
            <StarIcon outline={true} strokeWidth={4} className="text-amber-300 size-4 xl:size-auto" size={20} />
          </motion.div>
        </div>
        <motion.div
          key={`logo2-${key2}`}
          initial={{ opacity: 0, x: 10 }}
          animate={(shouldAnimateLine2 || isInView) ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
          transition={{
            duration: 0.3,
            delay: shouldAnimateLine2 ? (0.5 + (4 * 0.1)) : secondLineLogoDelay,
            ease: "easeOut"
          }}
          className="w-22"
        >
          <Image src="/images/google-logo.svg" alt="Google " width={60} height={30} />
        </motion.div>
      </div>
    </div>
  )
}