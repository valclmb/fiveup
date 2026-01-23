"use client"
import { motion } from "motion/react";
import { ReactNode, useRef } from "react";


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
        transition={{ duration: 0.5, ease: "easeInOut" }}
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
