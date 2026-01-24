"use client"
import { buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const HeaderCta = ({ className }: { className?: string }) => {
  const { data: session } = authClient.useSession();

  return (
    <div className={cn('space-x-2 md:gap-0  items-center', className)}>
      <Link href={session ? "/dashboard" : "/auth/signin"} className={buttonVariants({ variant: "secondary", className: "flex-1 md:w-auto" })}>
        {session ? "Dashboard" : "Sign in"}
      </Link>
      {!session &&
        <Link href={"/auth/signup"} className={buttonVariants({ variant: "landing", className: "flex-1 md:w-auto" })}>
          Start now
        </Link>}

    </div>
  );
};
