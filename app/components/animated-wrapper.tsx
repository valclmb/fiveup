"use client";
import { motion, useScroll, useTransform } from "motion/react";
import { ReactNode, useRef } from "react";

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
      viewport={{ once: false, margin: "-100px" }}
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

interface AnimatedFadeProps {
  children: ReactNode;
  className?: string;
  as?: "section" | "div";
  once?: boolean;
}

export const AnimatedFade = ({ children, className = "", as = "div", once = false }: AnimatedFadeProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  if (as === "section") {
    return (
      <motion.section
        ref={sectionRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once, margin: "-100px" }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className={className}
      >
        {children}
      </motion.section>
    );
  }

  return (
    <motion.div
      ref={divRef}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once, margin: "-100px" }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
