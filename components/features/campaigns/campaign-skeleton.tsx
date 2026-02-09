"use client";

import { Skeleton } from "@/components/ui/skeleton";

const SKELETON_COUNT = 4;

export function CampaignSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <Skeleton key={i} className="h-32 w-full max-w-2xl rounded-lg" />
      ))}
    </div>
  );
}
