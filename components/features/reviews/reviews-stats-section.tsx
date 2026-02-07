"use client";

import Image from "next/image";
import {
  SourceStatsCard,
  type SourceStats,
} from "@/components/features/reviews/source-stats-card";

export type { SourceStats };

export interface ReviewsStatsSectionProps {
  /** Stats per source - only include sources that are connected */
  statsBySource: {
    trustpilot?: SourceStats;
    google?: SourceStats;
  };
}

const DEFAULT_STATS: SourceStats = {
  total: 0,
  trustScore: null,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
};

export function ReviewsStatsSection({ statsBySource }: ReviewsStatsSectionProps) {
  const hasTrustpilot = !!statsBySource.trustpilot;
  const hasGoogle = !!statsBySource.google;

  const trustpilotStats = statsBySource.trustpilot ?? DEFAULT_STATS;
  const googleStats = statsBySource.google ?? DEFAULT_STATS;

  return (
    <div className="flex gap-4">
      {hasTrustpilot && (
        <SourceStatsCard
          stats={trustpilotStats}
          starColor="#00b67a"
          logo={
            <>
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
            </>
          }
        />
      )}

      {hasGoogle && (
        <SourceStatsCard
          stats={googleStats}
          starColor="#4285f4"
          logo={
            <Image
              src="/images/google-logo.svg"
              alt="Google Maps"
              width={70}
              height={18}
              className="object-contain"
            />
          }
        />
      )}
    </div>
  );
}
