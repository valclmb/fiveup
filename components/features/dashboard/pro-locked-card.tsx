"use client";

import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import Link from "next/link";

type ProLockedCardProps = {
  locked: boolean;
  children: React.ReactNode;
  className?: string;
};

/**
 * Wraps dashboard content. When locked (free plan), blurs content and shows
 * an overlay with a CTA to upgrade to Pro.
 */
export function ProLockedCard({ locked, children, className }: ProLockedCardProps) {
  if (!locked) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`relative min-h-0 flex flex-col min-[1200px]:[&>div]:flex-1 border rounded-xl ${className ?? ""}`}>
      <div className="pointer-events-none select-none min-h-[200px] min-[1200px]:min-h-0 flex-1 overflow-hidden rounded-xl [&>*]:blur-[6px] [&>*]:opacity-60">
        {children}
      </div>
      <div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-xl bg-card/70 backdrop-blur-sm p-6"
        aria-hidden={false}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="rounded-full bg-primary/10 p-3">
            <Lock className="size-6 text-primary" aria-hidden />
          </div>
          <p className="text-sm font-medium text-foreground">
            Upgrade to Pro to unlock
          </p>
          <p className="text-xs text-muted-foreground max-w-[220px]">
            Get full access to analytics, recent reviews and more.
          </p>
        </div>
        <Button asChild size="sm" className="pointer-events-auto">
          <Link href="/pricing">View plans</Link>
        </Button>
      </div>
    </div>
  );
}
