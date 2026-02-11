"use client";

import { authClient } from "@/lib/auth-client";
import { getAll } from "@/lib/fetch";
import { useQuery } from "@tanstack/react-query";
import type { RecentReview } from "./recent-reviews";
import { ProLockedCard } from "./pro-locked-card";
import { RecentReviews } from "./recent-reviews";
import { ReviewsChart } from "./reviews-chart";
import { Sources } from "./sources";

type StatsResponse = {
  data: Array<{
    month: string;
    avis: number;
    fullMonth: string;
    bySource: { trustpilot: number; google: number };
  }>;
  recentReviews: RecentReview[];
  statsBySource: Record<string, { total: number; trustScore: number | null; distribution: Record<number, number> }>;
};

export function DashboardOverview() {
  const { data: session } = authClient.useSession();
  const plan = (session?.user as { plan?: string } | undefined)?.plan ?? "free";
  const isPro = plan !== "free";

  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await getAll<StatsResponse | { error: string }>("stats");
      if (res && "error" in res && res.error) {
        throw new Error(res.error);
      }
      return res as StatsResponse;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 min-[1200px]:grid-cols-[2fr_1fr] min-[1200px]:grid-rows-[1fr_1fr] gap-6 min-[1200px]:min-h-[600px]">
        <div className="min-h-[200px] min-[1200px]:min-h-0 animate-pulse rounded-lg bg-muted" />
        <div className="min-h-[200px] min-[1200px]:min-h-0 animate-pulse rounded-lg bg-muted" />
        <div className="min-h-[200px] min-[1200px]:min-h-0 animate-pulse rounded-lg bg-muted" />
        <div className="min-h-[200px] min-[1200px]:min-h-0 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 min-[1200px]:grid-cols-[2fr_1fr] min-[1200px]:grid-rows-[1fr_1fr] gap-6 min-[1200px]:min-h-[600px]">
      <ProLockedCard locked={!isPro}>
        <ReviewsChart
          data={data?.data ?? null}
          error={error?.message ?? null}
        />
      </ProLockedCard>
      <div className="min-h-0 flex flex-col min-[1200px]:[&>div]:flex-1">
        <Sources statsBySource={data?.statsBySource ?? {}} />
      </div>
      <ProLockedCard locked={!isPro}>
        <RecentReviews reviews={data?.recentReviews ?? []} />
      </ProLockedCard>
      <ProLockedCard locked={!isPro}>
        <div className="min-h-0 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20" />
      </ProLockedCard>
    </div>
  );
}
