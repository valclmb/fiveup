"use client";
import { useIsMobile } from "@/lib/use-is-mobile";
import { motion, useScroll, useTransform } from "motion/react";
import { ReactNode, useEffect, useRef, useState } from "react";

// Hero animations
interface AnimatedHeroItemProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: "fadeUp" | "fadeDown" | "scaleUp";
}

export const AnimatedHeroItem = ({
  children,
  delay = 0,
  className = "",
  variant = "fadeUp"
}: AnimatedHeroItemProps) => {
  if (variant === "scaleUp") {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut", delay }}
      >
        {children}
      </motion.div>
    );
  }

  if (variant === "fadeDown") {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedHeroSpanProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: "fadeUp" | "scaleIn";
}

export const AnimatedHeroSpan = ({
  children,
  delay = 0,
  className = "",
  variant = "fadeUp"
}: AnimatedHeroSpanProps) => {
  if (variant === "scaleIn") {
    return (
      <motion.span
        className={className}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut", delay }}
      >
        {children}
      </motion.span>
    );
  }

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut", delay }}
    >
      {children}
    </motion.span>
  );
};

interface AnimatedLandingHeaderProps {
  children: ReactNode;
}

export const AnimatedLandingHeader = ({ children }: AnimatedLandingHeaderProps) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.3,
            delayChildren: 0.2
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedLandingItemProps {
  children: ReactNode;
}

export const AnimatedLandingItem = ({ children }: AnimatedLandingItemProps) => {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
      {children}
    </motion.div>
  );
};

interface AnimatedFadeUpProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const AnimatedFadeUp = ({ children, delay = 0, className = "" }: AnimatedFadeUpProps) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedBenefitItemProps {
  children: ReactNode;
  delay?: number;
}

export const AnimatedBenefitItem = ({ children, delay = 0 }: AnimatedBenefitItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ delay, duration: 0.3 }}
      className="w-full lg:w-1/3"
    >
      {children}
    </motion.div>
  );
};

interface AnimatedImpactItemProps {
  children: ReactNode;
  delay?: number;
  fromLeft?: boolean;
  className?: string;
}

export const AnimatedImpactItem = ({ children, delay = 0, fromLeft = false, className = "" }: AnimatedImpactItemProps) => {
  const isMobile = useIsMobile();

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y: 30,
        x: fromLeft ? -50 : 0
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0
      }}
      viewport={{ once: false, margin: isMobile ? "0px" : "-100px" }}
      transition={{
        delay,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedSectionProps {
  children: ReactNode;
  fromLeft: boolean;
  delay?: number;
  className?: string;
}

export const AnimatedSection = ({ children, fromLeft, delay = 0, className = "" }: AnimatedSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const start = 0.05 + (delay * 0.3);
  const end = 0.3 + (delay * 0.3);

  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const x = useTransform(
    scrollYProgress,
    [start, end],
    [fromLeft ? -300 : 300, 0]
  );

  // Sur mobile, utiliser whileInView au lieu de scroll progress
  // Utiliser once: true et margin plus permissif pour s'assurer que ça fonctionne
  if (isMobile) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: fromLeft ? -30 : 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, margin: "0px" }}
        transition={{ delay, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      style={{ opacity, x }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedCardProps {
  children: ReactNode;
  fromLeft: boolean;
  delay?: number;
  className?: string;
}

export const AnimatedCard = ({ children, fromLeft, delay = 0, className = "" }: AnimatedCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const start = 0.05 + (delay * 0.3);
  const end = 0.3 + (delay * 0.3);

  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const x = useTransform(
    scrollYProgress,
    [start, end],
    [fromLeft ? -300 : 300, 0]
  );

  // Sur mobile, utiliser whileInView au lieu de scroll progress
  if (isMobile) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: fromLeft ? -30 : 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, margin: "0px" }}
        transition={{ delay, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      style={{ opacity, x }}
      className={className}
    >
      {children}
    </motion.div>
  );
};


interface AnimatedHeaderWrapperProps {
  children: ReactNode;
  className?: string;
}

export const AnimatedHeaderWrapper = ({ children, className = "" }: AnimatedHeaderWrapperProps) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const threshold = 8; // ~ top-2
    const onScroll = () => setIsSticky(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      className={className}
      initial={{ y: -100, opacity: 0 }}
      animate={{
        y: isSticky ? 5 : 0,
        scale: isSticky ? 0.98 : 1,
        opacity: 1
      }}
      transition={{
        y: { type: "spring", stiffness: 520, damping: 42, mass: 0.7 },
        scale: { type: "spring", stiffness: 320, damping: 26, mass: 0.5 },
        opacity: { duration: 0.5, ease: "easeOut" }
      }}
      style={{ willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
};
