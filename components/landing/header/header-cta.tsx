"use client"
import { buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export const HeaderCta = ({ direction = "horizontal" }: { direction?: "horizontal" | "vertical" }) => {
  const { data: session } = authClient.useSession();

  const containerClassName = cn("hidden sm:flex items-center gap-3",
    direction === "horizontal" ? "flex-row" : "flex-col md:flex-row p-4");

  const buttonClassName = cn(
    direction === "vertical" ? "flex-1 w-full" : ""
  );

  if (session) {
    return (
      <div className={containerClassName}>
        <Link href="/dashboard" className={buttonVariants({ variant: "secondary", className: buttonClassName })} >
          Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className={containerClassName}>
      <Link href="/auth/signin" className={buttonVariants({ variant: "secondary", className: buttonClassName })} >
        Sign in
      </Link>
      <Link href="/auth/signup" className={buttonVariants({ variant: "landing", className: buttonClassName })} >
        Get more reviews <ChevronRight data-icon="inline-end" />
      </Link>
    </div>
  );
};