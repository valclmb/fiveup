import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const pillContainerVariants = cva("p-[5px] bg-pill-background", {
  variants: {
    variant: {
      default: "rounded-full w-max",
      button: "rounded-2xl",
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
        default: "rounded-full ",
        button: "rounded-2xl size-[60px]",
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

export const Pills = ({
  children,
  className,
  variant = "default",
  size = "default",
}: {
  children: React.ReactNode
  className?: string
  variant?: PillsVariant
  size?: "default" | "lg"
}) => {
  return (
    <div className={cn(pillContainerVariants({ variant }), className)}>
      <div className={pillInnerVariants({ variant, size })}>{children}</div>
    </div>
  )
}