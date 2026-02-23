"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CampaignSkeleton() {
  return (
    <Card className="relative w-full max-w-sm p-0 rounded-3xl overflow-hidden">
      <Skeleton className="h-96 w-full rounded-none" />
    </Card>
  );
}
