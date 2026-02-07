"use client";

import { ReviewsList } from "@/components/features/reviews/reviews-list";
import {
  ReviewsStatsSection,
  type SourceStats,
} from "@/components/features/reviews/reviews-stats-section";
import { useQuery } from "@tanstack/react-query";
import { getAll } from "@/lib/fetch";

interface StatsResponse {
  statsBySource: {
    trustpilot?: SourceStats;
    google?: SourceStats;
  };
}

const emptyStats: SourceStats = {
  total: 0,
  trustScore: null,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
};

export default function ReviewsPage() {
  const { data: statsData } = useQuery({
    queryKey: ["reviews-stats"],
    queryFn: () => getAll<StatsResponse>("reviews/stats"),
  });

  const statsBySource = statsData?.statsBySource ?? {};
  const hasTrustpilot = !!statsBySource.trustpilot;
  const hasGoogle = !!statsBySource.google;

  const normalizedStatsBySource = {
    ...(hasTrustpilot
      ? { trustpilot: statsBySource.trustpilot ?? emptyStats }
      : {}),
    ...(hasGoogle ? { google: statsBySource.google ?? emptyStats } : {}),
  };

  const hasAnyStats = hasTrustpilot || hasGoogle;

  return (
    <div className="space-y-6">
      {hasAnyStats && (
        <ReviewsStatsSection statsBySource={normalizedStatsBySource} />
      )}

      <ReviewsList hasTrustpilot={hasTrustpilot} hasGoogle={hasGoogle} />
    </div>
  );
}
