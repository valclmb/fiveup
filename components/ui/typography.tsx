import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

export const typographyVariants = cva(`text-xl `, {
  variants: {
    variant: {
      h1: "scroll-m-20 text-[clamp(1.75rem,5vw,3.75rem)] tracking-tight text-[70px] leading-[80px]",
      h2: "scroll-m-20 pb-2 text-[clamp(2rem,5vw,3rem)] leading-[clamp(2.5rem,5vw,4rem)] leading-[120%] mt-6 mb-10  tracking-tight first:mt-0 ",
      h3: "scroll-m-20 text-[clamp(1rem,3vw,1.15rem)]   tracking-tight",
      h4: "scroll-m-20 text-xl tracking-tight",
      p: `text-base leading-7 `,
      blockquote: `text-base leading-7`,
      // [&:not(:first-child)]:mt-6
      // list: "my-6 ml-6 list-disc [&>li]:mt-2",
    },
    affects: {
      default: "",
      lead: "text-xl text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm font-medium leading-none",
      muted: "text-muted-foreground",
      mutedDescription: "text-muted-foreground text-sm",
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
    if (variant === "blockquote") {
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