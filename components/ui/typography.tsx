import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Cal_Sans, Inter, Poppins } from "next/font/google";
import React from "react";

const poppins = Poppins({ weight: ['400', '500', '600', '700'], subsets: ['latin'], variable: '--font-poppins' });
//const poppins = Cal_Sans({ weight: '400', subsets: ['latin'], variable: '--font-cal-sans' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const headingFontClassName = poppins.className;

export const typographyVariants = cva(`text-xl ${poppins.className}`, {
  variants: {
    variant: {
      h1: "scroll-m-20 text-[clamp(1.75rem,5vw,3.75rem)] font-semibold tracking-tight ",
      h2: "scroll-m-20 pb-2 text-[clamp(2rem,5vw,2.75rem)] leading-[clamp(2.5rem,5vw,4rem)]  lg:text-left mt-6 mb-10 font-semibold tracking-tight first:mt-0 ",
      h3: "scroll-m-20 text-[clamp(1rem,3vw,1.5rem)]  lg:text-left font-bold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      p: `text-base leading-7 ${inter.className}`,
      blockquote: `text-base leading-7 ${inter.className}`,
      description: `description text-sm leading-7 ${inter.className}`,
      // [&:not(:first-child)]:mt-6
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
  extends React.HTMLAttributes<HTMLElement>,
  VariantProps<typeof typographyVariants> { }

const Typography = React.forwardRef<any, TypographyProps>(
  ({ className, variant, affects, ...props }, ref) => {
    let Comp: React.ElementType = "p"
    if (variant === "description") {
      Comp = "p"
    } else if (variant === "blockquote") {
      Comp = "blockquote"
    } else if (variant === "h1" || variant === "h2" || variant === "h3" || variant === "h4") {
      Comp = variant
    } else if (variant === "p") {
      Comp = "p"
    } else {
      Comp = "p"
    }
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