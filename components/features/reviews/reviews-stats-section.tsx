"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Typography from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import Image from "next/image";

export interface SourceStats {
  total: number;
  trustScore: number | null;
  distribution: Record<number, number>;
}

export interface ReviewsStatsSectionProps {
  /** Stats per source - only include sources that are connected */
  statsBySource: {
    trustpilot?: SourceStats;
    google?: SourceStats;
  };
}

const DEFAULT_DISTRIBUTION: Record<number, number> = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
};

function StarRating({
  rating,
  starColor = "#00b67a",
}: {
  rating: number;
  starColor?: string;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn("size-4", star <= rating ? "fill-current" : "fill-muted text-muted")}
          style={star <= rating ? { color: starColor } : undefined}
        />
      ))}
    </div>
  );
}

function DistributionBar({
  distribution,
  total,
  barColor = "#00b67a",
}: {
  distribution: Record<number, number>;
  total: number;
  barColor?: string;
}) {
  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((rating) => {
        const count = distribution[rating] ?? 0;
        const percentage = total > 0 ? (count / total) * 100 : 0;
        return (
          <div key={rating} className="flex items-center gap-2 text-sm">
            <span className="w-4 text-muted-foreground">{rating}</span>
            <Star className="size-3 fill-current" style={{ color: barColor }} />
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${percentage}%`, backgroundColor: barColor }}
              />
            </div>
            <span className="w-8 text-right text-muted-foreground">{count}</span>
          </div>
        );
      })}
    </div>
  );
}

export function ReviewsStatsSection({ statsBySource }: ReviewsStatsSectionProps) {
  const hasTrustpilot = !!statsBySource.trustpilot;
  const hasGoogle = !!statsBySource.google;

  const trustpilotStats = statsBySource.trustpilot ?? {
    total: 0,
    trustScore: null,
    distribution: { ...DEFAULT_DISTRIBUTION },
  };
  const googleStats = statsBySource.google ?? {
    total: 0,
    trustScore: null,
    distribution: { ...DEFAULT_DISTRIBUTION },
  };

  const avgFromStats = (s: SourceStats) =>
    s.trustScore != null
      ? s.trustScore
      : s.total > 0
        ? Object.entries(s.distribution ?? {}).reduce(
            (acc, [rating, count]) => acc + Number(rating) * count,
            0
          ) / s.total
        : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {hasTrustpilot && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Image
                src="/images/trustpilot-logo.svg"
                alt="Trustpilot"
                width={70}
                height={18}
                className="hidden object-contain dark:block"
              />
              <Image
                src="/images/trustpilot-logo-dark.svg"
                alt="Trustpilot"
                width={70}
                height={18}
                className="object-contain dark:hidden"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">
                {avgFromStats(trustpilotStats).toFixed(1)}
              </span>
              <StarRating rating={Math.round(avgFromStats(trustpilotStats))} starColor="#00b67a" />
            </div>
            <Typography variant="description" className="mt-1">
              {trustpilotStats.total} reviews
            </Typography>
          </CardContent>
        </Card>
      )}

      {hasGoogle && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Image
                src="/images/google-logo.svg"
                alt="Google Maps"
                width={70}
                height={18}
                className="object-contain"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">
                {avgFromStats(googleStats).toFixed(1)}
              </span>
              <StarRating rating={Math.round(avgFromStats(googleStats))} starColor="#4285f4" />
            </div>
            <Typography variant="description" className="mt-1">
              {googleStats.total} reviews
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Distribution card - Trustpilot only (Google doesn't provide distribution data) */}
      {hasTrustpilot && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Distribution</CardTitle>
            <Typography variant="description" className="text-xs">
              Trustpilot rating distribution
            </Typography>
          </CardHeader>
          <CardContent>
            <DistributionBar
              distribution={trustpilotStats.distribution ?? DEFAULT_DISTRIBUTION}
              total={trustpilotStats.total}
              barColor="#00b67a"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
