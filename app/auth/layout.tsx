import RatingCard from "@/components/rating-card"
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern"
import { Card } from "@/components/ui/card"
import Typography from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-background p-4 py-12 sm:px-6 lg:px-8">
      <Card className="hidden lg:flex bg-[#10CEA5]  relative  w-1/2 overflow-hidden rounded-3xl border p-14">
        <AnimatedGridPattern
          width={120}
          height={120}
          x={-1}
          y={-20}
          strokeDasharray={3}
          numSquares={20}
          maxOpacity={1}
          duration={3}
          repeatDelay={1}

          className={cn(
            // "mask-[radial-gradient(800px_circle_at_center,white,transparent)]",
            "z-10 -x-0 inset-y-[-30%] h-[200%]",
            "stroke-white/40",
            "text-[#40D9B3]" // Couleur des carrés animés (utilise currentColor)
          )}
        />
        <div className='z-50 flex flex-col justify-between gap-32'>
          <Link href="/" className="hover:scale-105 transition-all duration-300 origin-left">
            <Image width={250} height={50} src="/logo-white.svg" alt="logo" />
          </Link>
          <Typography variant="h1" className="mb-0 text-2xl lg:text-4xl">Welcome to FiveUp</Typography>

        </div>
        <RatingCard platform="trustpilot" whiteMode={true} className=" left-32 bottom-82" delay={1} />
        <RatingCard platform="google" whiteMode={true} className=" left-50 bottom-42" delay={1} />
        <RatingCard platform="google" whiteMode={true} className=" right-32 bottom-68" delay={1} />


      </Card>
      <div className="relative max-w-96  w-full flex flex-col justify-center mx-auto">
        <Image width={200} height={50} src="/logo-white.svg" alt="logo" className=" lg:hidden mx-auto mb-14" />
        <div className="absolute blur-3xl  -top-32 left-1/2 -translate-x-1/2  size-30 bg-primary" />
        {children}
      </div>
    </div>
  )
}

export default AuthLayout