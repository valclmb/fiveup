"use client"
import Typography from "@/components/ui/typography"
import { Check, Pointer } from "lucide-react"
import { motion } from "motion/react"
import { useState } from "react"
import { StarIcon } from "../(landing)/components/star-icon"

const Review = () => {
  const [active, setActive] = useState(0)
  const [hoveredStar, setHoveredStar] = useState<number | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)

  const handleActive = () => {
    setActive(curr => {
      if (curr < 5) {
        if (curr === 4) {
          setIsCompleted(true)
        }
        return curr + 1
      }
      return curr
    })
  }

  // Configuration pour un arc de cercle avec 5 étoiles
  // Rayon du cercle (distance du centre)
  const radius = 90
  // Angle de départ (en degrés, -60° pour commencer en bas à droite)
  const startAngle = 180
  // Angle total de l'arc (120° pour un arc symétrique)
  const arcAngle = -180
  // Nombre d'étoiles
  const starCount = 5

  // Calculer les positions de chaque étoile
  const getStarPosition = (index: number) => {
    // Angle pour cette étoile (réparties uniformément sur l'arc)
    const angle = startAngle + (arcAngle / (starCount - 1)) * index
    // Convertir en radians
    const angleRad = (angle * Math.PI) / 180
    // Calculer x et y avec trigonométrie
    // En CSS, Y est inversé (positif = vers le bas), donc on inverse le signe
    const x = Math.cos(angleRad) * radius
    const y = -Math.sin(angleRad) * radius // Inversé pour CSS
    return { x, y }
  }

  return (
    <div className="p-10 bg-white h-screen flex flex-col justify-center items-center gap-5 ">
      <Typography variant="h1" className="text-center text-black">Donnez votre avis</Typography>
      <div className="relative w-[280px] h-[280px] flex items-center justify-center">
        <motion.button
          onClick={handleActive}
          className="z-10 relative flex items-center justify-center bg-primary text-white px-4 py-2 size-24 rounded-full transition-all shadow-xl active:shadow-md after:content-[''] after:absolute after:inset-0 after:rounded-full after:bg-primary">
          <motion.div
            style={{
              perspective: "1000px",
              transformStyle: "preserve-3d",
            }}
            animate={{
              rotateX: [0, -25, 0, -25, 0], // Rotation 3D vers l'avant puis retour
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
              repeat: Infinity,
              repeatDelay: 2, // Pause de 3 secondes entre chaque répétition
            }}
            className="z-10 flex items-center justify-center"
          >
            <motion.span

              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex items-center justify-center"
            >
              {isCompleted ? <Check size={42} className="text-white z-10" /> : <Pointer size={42} className="text-white z-10" />}
            </motion.span>
          </motion.div>
        </motion.button>
        <div className="absolute inset-0">
          {/* Étoiles positionnées en arc de cercle */}
          {[1, 2, 3, 4, 5].map((starIndex) => {
            const position = getStarPosition(starIndex - 1)
            const isActive = active >= starIndex


            return (
              <motion.div
                key={starIndex}
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 0,
                  scale: 0
                }}
                animate={isActive ? {
                  x: position.x - 20,
                  y: position.y - 20,
                  opacity: 1,
                  scale: 1
                } : {
                  x: 0,
                  y: 0,
                  opacity: 0,
                  scale: 0
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
                className="z-0 absolute"
                style={{
                  left: "50%",
                  top: "50%",
                }}
                onMouseEnter={() => setHoveredStar(starIndex)}
                onMouseLeave={() => setHoveredStar(null)}
                onClick={() => setActive(starIndex)}
              >
                <StarIcon
                  size={42}

                  className={`text-amber-300 hover:scale-110 transition-all duration-300 ${hoveredStar !== null && starIndex <= hoveredStar ? "brightness-80" : ""
                    }`}
                />
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Review