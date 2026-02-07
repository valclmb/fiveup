"use client";

import { StarIcon } from "@/app/(landing)/components/star-icon";
import { Card, CardContent } from "@/components/ui/card";
import Typography from "@/components/ui/typography";
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

function DistributionBar({
  distribution,
  total,
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
    <div className=" flex  gap-4 ">
      {hasTrustpilot && (
        <Card>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className=" flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-4">
                  <Image
                    src="/images/trustpilot-logo.svg"
                    alt="Trustpilot"
                    width={90}
                    height={18}
                    className="hidden object-contain dark:block"
                  />
                  <Image
                    src="/images/trustpilot-logo-dark.svg"
                    alt="Trustpilot"
                    width={90}
                    height={18}
                    className="object-contain dark:hidden"
                  />
                </div>
                <div className="flex gap-6">
                  <div>
                    <Typography variant="description" className=" text-muted-foreground">
                      Nombre d&apos;avis
                    </Typography>
                    <span className="text-2xl font-bold">{trustpilotStats.total}</span>
                  </div>
                  <div >
                    <Typography variant="description" className=" text-muted-foreground">
                      Note moyenne
                    </Typography>
                    <div className="flex items-center gap-1 ">
                      <StarIcon className="size-4" />
                      <span className="text-2xl font-bold">
                        {avgFromStats(trustpilotStats).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 sm:pl-6 pt-4 sm:pt-0 min-w-[140px]">
                <DistributionBar
                  distribution={trustpilotStats.distribution ?? DEFAULT_DISTRIBUTION}
                  total={trustpilotStats.total}
                  barColor="#00b67a"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {hasGoogle && (
        <Card>
          <CardContent className="h-full flex flex-col justify-between gap-0">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/images/google-logo.svg"
                alt="Google Maps"
                width={70}
                height={18}
                className="object-contain"
              />
            </div>
            <div className="flex gap-6 justify-between">
              <div>
                <Typography variant="description" className=" text-muted-foreground">
                  Nombre d&apos;avis
                </Typography>
                <span className="text-2xl font-bold">{googleStats.total}</span>
              </div>
              <div >
                <Typography variant="description" className=" text-muted-foreground">
                  Note moyenne
                </Typography>
                <div className="flex items-center gap-1 ">
                  <StarIcon className="size-4" />
                  <span className="text-2xl font-bold">
                    {avgFromStats(googleStats).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )
      }
    </div >
  );
}
