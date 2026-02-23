"use client";

import { StarIcon } from "@/components/custom-ui/star-icons";
import { Card, CardContent } from "@/components/ui/card";
import Typography from "@/components/ui/typography";
import { formatDistanceToNow } from "date-fns";

export interface SourceStats {
  total: number;
  trustScore: number | null;
  distribution: Record<number, number>;
  lastSyncAt?: string | null;
}

const DEFAULT_DISTRIBUTION: Record<number, number> = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
};

function DistributionBar({
  distribution,
  total,
}: {
  distribution: Record<number, number>;
  total: number;
}) {
  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((rating) => {
        const count = distribution[rating] ?? 0;
        const percentage = total > 0 ? (count / total) * 100 : 0;
        return (
          <div key={rating} className="flex items-center gap-2 text-sm">
            <StarIcon className="size-4 fill-current" />
            <span className="w-4 text-muted-foreground">{rating}</span>
            <div className="flex-1 min-w-42 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all bg-primary"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="w-8 text-right text-muted-foreground">{count}</span>
          </div>
        );
      })}
    </div>
  );
}

function avgFromStats(s: SourceStats): number {
  return s.trustScore != null
    ? s.trustScore
    : s.total > 0
      ? Object.entries(s.distribution ?? {}).reduce(
        (acc, [rating, count]) => acc + Number(rating) * count,
        0
      ) / s.total
      : 0;
}

export interface SourceStatsCardProps {
  stats: SourceStats;
  logo: React.ReactNode;
  starColor?: string;
}

export function SourceStatsCard({
  stats,
  logo,
  starColor = "#00b67a",
}: SourceStatsCardProps) {
  const distribution = stats.distribution ?? DEFAULT_DISTRIBUTION;
  const avg = avgFromStats(stats);

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-4">{logo}</div>
            <div className="flex gap-6">
              <div>
                <Typography variant="description" className="text-muted-foreground">
                  Nombre d&apos;avis
                </Typography>
                <span className="text-2xl font-bold">{stats.total}</span>
              </div>
              <div>
                <Typography variant="description" className="text-muted-foreground">
                  Note moyenne
                </Typography>
                <div className="flex items-center gap-1">
                  <StarIcon className="size-4" color={starColor} />
                  <span className="text-2xl font-bold">{avg.toFixed(1)}</span>
                </div>
              </div>
            </div>
            {stats.lastSyncAt && (
              <Typography variant="description" className="text-muted-foreground text-sm mt-2">
                Last sync {formatDistanceToNow(new Date(stats.lastSyncAt), { addSuffix: true })}
              </Typography>
            )}
          </div>
          <div className="flex-shrink-0 sm:pl-6 pt-4 sm:pt-0 min-w-[140px]">
            <DistributionBar distribution={distribution} total={stats.total} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
