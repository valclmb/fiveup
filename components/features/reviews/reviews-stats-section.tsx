"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Typography from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import Image from "next/image";

export interface ReviewsStats {
  total: number;
  trustScore: number | null;
  distribution: Record<number, number>;
}

const DEFAULT_STATS: ReviewsStats = {
  total: 0,
  trustScore: null,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "size-4",
            star <= rating
              ? "fill-[#00b67a] text-[#00b67a]"
              : "fill-muted text-muted"
          )}
        />
      ))}
    </div>
  );
}

export function ReviewsStatsSection({ stats }: { stats?: ReviewsStats | null }) {
  const safeStats = stats ?? DEFAULT_STATS;
  const total = safeStats.total ?? 0;
  const distribution = safeStats.distribution ?? DEFAULT_STATS.distribution;

  // Use Trustpilot's trustScore when available, else calculate from distribution
  const avgRating =
    safeStats.trustScore != null
      ? safeStats.trustScore
      : total > 0
        ? Object.entries(distribution).reduce(
          (acc, [rating, count]) => acc + Number(rating) * count,
          0
        ) / total
        : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">{avgRating.toFixed(1)}</span>
            <StarRating rating={Math.round(avgRating)} />
          </div>
          <Typography variant="description" className="mt-1">
            {total} total reviews
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = distribution[rating] ?? 0;
              const percentage = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={rating} className="flex items-center gap-2 text-sm">
                  <span className="w-4 text-muted-foreground">{rating}</span>
                  <Star className="size-3 fill-[#00b67a] text-[#00b67a]" />
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00b67a] rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-muted-foreground">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Source</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Image
              src="/images/trustpilot-logo.svg"
              alt="Trustpilot"
              width={80}
              height={20}
              className="hidden object-contain dark:block"
            />
            <Image
              src="/images/trustpilot-logo-dark.svg"
              alt="Trustpilot"
              width={80}
              height={20}
              className=" object-contain dark:hidden"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
