"use client"

import { motion } from "motion/react"
import { Inconsolata } from "next/font/google"
import React, { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

const inconsolata = Inconsolata({ subsets: ["latin"] })

/**
 * BinaryPattern Component Props
 *
 * @param {number} [width=14] - Horizontal spacing between characters
 * @param {number} [height=14] - Vertical spacing between characters
 * @param {number} [fontSize=10] - Font size of 0/1 characters
 * @param {number} [x=0] - X offset of the pattern
 * @param {number} [y=0] - Y offset of the pattern
 * @param {string} [className] - Additional CSS classes (e.g. for color/opacity)
 * @param {boolean} [glow=false] - Whether characters have a subtle opacity animation
 */
interface BinaryPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  fontSize?: number
  x?: number
  y?: number
  className?: string
  glow?: boolean
  [key: string]: unknown
}

/** Deterministic 0 or 1 from grid position for stable pattern. */
function binaryAt(col: number, row: number): "0" | "1" {
  return (col * 7 + row * 13) % 2 === 0 ? "0" : "1"
}

export function BinaryPattern({
  width = 14,
  height = 14,
  fontSize = 10,
  x = 0,
  y = 0,
  className,
  glow = false,
  ...props
}: BinaryPatternProps) {
  const containerRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width: w, height: h } = containerRef.current.getBoundingClientRect()
        setDimensions({ width: w, height: h })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  const cols = Math.ceil(dimensions.width / width) + 1
  const rows = Math.ceil(dimensions.height / height) + 1
  const cells = Array.from({ length: cols * rows }, (_, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    return {
      col,
      row,
      x: col * width + x,
      y: row * height + y,
      char: binaryAt(col, row),
      delay: Math.random() * 4,
      duration: Math.random() * 2 + 2,
    }
  })

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        inconsolata.className,
        "pointer-events-none absolute inset-0 h-full w-full fill-current text-foreground/25",
        className
      )}
      {...props}
    >
      {cells.map((cell) => (
        <motion.text
          key={`${cell.col}-${cell.row}`}
          x={cell.x}
          y={cell.y}
          fontSize={fontSize}
          fill="currentColor"
          initial={glow ? { opacity: 0.3 } : {}}
          animate={
            glow
              ? {
                opacity: [0.3, 0.7, 0.3],
              }
              : {}
          }
          transition={
            glow
              ? {
                duration: cell.duration,
                repeat: Infinity,
                repeatType: "reverse",
                delay: cell.delay,
                ease: "easeInOut",
              }
              : {}
          }
        >
          {cell.char}
        </motion.text>
      ))}
    </svg>
  )
}
