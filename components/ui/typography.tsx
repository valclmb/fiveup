import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Inter, Poppins } from "next/font/google";
import React from "react";

const poppins = Poppins({weight:['400','500','600','700'],subsets:['latin'],variable:'--font-poppins'});
const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const typographyVariants = cva(`text-xl ${poppins.className}`, {
  variants: {
    variant: {
      h1: "scroll-m-20 text-6xl font-semibold tracking-tight lg: text-5xl",
      h2: "scroll-m-20  pb-2 text-5xl font-semibold tracking-tight first:mt-0",
      h3: "scroll-m-20 text-xl  tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      p: `text-base leading-7 ${inter.className}`,
      description: `description text-sm leading-7 ${inter.className}`,
      // [&:not(:first-child)]:mt-6
      // blockquote: "mt-6 border-l-2 pl-6 italic",
      // list: "my-6 ml-6 list-disc [&>li]:mt-2",
    },
    affects: {
      default: "",
      lead: "text-xl text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm font-medium leading-none",
      muted: "text-sm text-muted-foreground",
      removePMargin: "[&:not(:first-child)]:mt-0",
    },
  },
  defaultVariants: {
    variant: "h1",
    affects: "default",
  },
})

export interface TypographyProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof typographyVariants> {}

const Typography = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, variant, affects, ...props }, ref) => {
    const Comp = variant === "description" ? "p" : variant || "p"
    return (
      <Comp
        className={cn(typographyVariants({ variant, affects, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Typography.displayName = "H1"

export default Typography