import { cn } from "@/lib/utils";
import Image from "next/image";
import * as React from "react";
import { Badge } from "../ui/badge";
import Typography from "../ui/typography";

type LandingBlockProps = React.HTMLAttributes<HTMLDivElement>;

const LandingBlockRoot = React.forwardRef<HTMLDivElement, LandingBlockProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          "relative flex flex-col items-center py-24",
          className,
        )}
        {...props}
      >
        {children}
      </section>
    );
  },
);
LandingBlockRoot.displayName = "LandingBlock";

type LandingBadgeProps = React.HTMLAttributes<HTMLDivElement>;

const LandingBadge = ({ className, children, ...props }: LandingBadgeProps) => {
  return (
    <Badge
      className={className}
      variant="secondary"

      {...props}
    >
      {children}
    </Badge>
  );
};

type LandingTitleProps = React.ComponentProps<typeof Typography>;

const LandingTitle = ({ className, ...props }: LandingTitleProps) => {
  return (
    <Typography
      variant="h2"
      className={cn("max-w-xl mt-4 text-center", className)}
      {...props}
    />
  );
};

type LandingContentProps = React.HTMLAttributes<HTMLDivElement>;

const LandingContent = ({ className, children, ...props }: LandingContentProps) => {
  return (
    <div
      className={cn(" w-full max-w-6xl mt-6 space-y-6 md:space-y-8", className)}
      {...props}
    >
      {children}
    </div>
  );
};

type LandingOrbProps = React.HTMLAttributes<HTMLDivElement> & { icon?: boolean };


const LandingOrb = ({ className, icon = false, ...props }: LandingOrbProps) => {
  return (
    <div className="absolute  top-20 -right-32">
      <div className="absolute w-md h-20 rounded-[50%] bg-primary/30 blur-[100px]" />

      {icon && (
        <Image
          width={410}
          height={260}
          src="/landing/background-icon.svg"
          alt="background icon"
          className="
         relative
         [mask-image:radial-gradient(75%_70%_at_50%_50%,white_20%,transparent_100%)]
       "
        />
      )}
    </div>
  )
}

export const LandingBlock = Object.assign(LandingBlockRoot, {
  Badge: LandingBadge,
  Title: LandingTitle,
  Content: LandingContent,
  Orb: LandingOrb
});