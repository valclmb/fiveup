import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const pillContainerVariants = cva("p-[5px] bg-pill-background", {
  variants: {
    variant: {
      default: "rounded-full w-max",
      button: "rounded-2xl",
      buttonRounded: "rounded-full p-2",
    },

  },
  defaultVariants: {
    variant: "default",
  },
})

const pillInnerVariants = cva(
  "border border-secondary bg-[radial-gradient(72.15%_68.18%_at_50%_14.2%,var(--pill-gradient)_0%,var(--pill)_100%)] flex items-center justify-center shadow-[0_6px_12px_rgba(0,0,0,0.8)]",
  {
    variants: {
      variant: {
        default: "rounded-full",
        button: "rounded-xl  size-[60px]",
        buttonRounded: "rounded-full aspect-square",
      },
      size: {
        default: "py-2 px-3",
        lg: "py-4 px-5"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },

  }
)

export type PillsVariant = VariantProps<typeof pillContainerVariants>["variant"]

export const PillsBlured = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn("p-1.5 rounded-full bg-background/2 backdrop-blur-xl border-[0.3px] border-white/10 [box-shadow:0_10.602px_3.313px_0_rgba(0,0,0,0),0_7.289px_2.651px_0_rgba(0,0,0,0.01),0_3.976px_2.651px_0_rgba(0,0,0,0.05),0_1.988px_1.988px_0_rgba(0,0,0,0.09),0_0.663px_0.663px_0_rgba(0,0,0,0.1)]", className)}
    >
      {children}
    </div>
  )
}

export const Pills = ({
  children,
  className,
  innerClassName,
  variant = "default",
  size = "default",
}: {
  children: React.ReactNode
  className?: string
  innerClassName?: string
  variant?: PillsVariant
  size?: "default" | "lg"
}) => {
  return (
    <div className={cn(pillContainerVariants({ variant }), className)}>
      <div className={cn(pillInnerVariants({ variant, size }), innerClassName)}>{children}</div>
    </div>
  )
}