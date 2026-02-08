"use client";

import { StarIcon } from "@/app/(landing)/components/star-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

type SourceStats = {
  total: number;
  trustScore: number | null;
  distribution: Record<number, number>;
};

type StatsBySource = {
  TRUSTPILOT?: SourceStats;
  GOOGLE?: SourceStats;
};

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

export function Sources({ statsBySource }: { statsBySource: StatsBySource }) {
  const sources = [
    {
      key: "TRUSTPILOT" as const,
      label: "Trustpilot",
      logo: (
        <>
          <Image
            src="/images/trustpilot-logo.svg"
            alt="Trustpilot"
            width={100}
            height={22}
            className="hidden object-contain dark:block"
          />
          <Image
            src="/images/trustpilot-logo-dark.svg"
            alt="Trustpilot"
            width={100}
            height={22}
            className="object-contain dark:hidden"
          />
        </>
      ),
      reviewsUrl: "/reviews?source=trustpilot",
    },
    {
      key: "GOOGLE" as const,
      label: "Google",
      logo: (
        <Image
          src="/images/google-logo.svg"
          alt="Google"
          width={70}
          height={22}
          className="object-contain"
        />
      ),
      reviewsUrl: "/reviews?source=google",
    },
  ];

  const totalReviews = sources.reduce(
    (sum, s) => sum + (statsBySource[s.key]?.total ?? 0),
    0
  );

  const connectedSources = sources.filter((s) => statsBySource[s.key]);

  if (connectedSources.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Sources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Aucune source connectée. Connectez Trustpilot ou Google pour afficher vos avis.
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link href="/connections">+ Connecter une source</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold decoration-primary">
          Sources
        </CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/connections">+ Connecter</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {connectedSources.map(({ key, label, logo, reviewsUrl }) => {
            const stats = statsBySource[key]!;
            const avg = avgFromStats(stats);
            const percent =
              totalReviews > 0 ? Math.round((stats.total / totalReviews) * 100) : 0;

            return (
              <Card key={key} className="flex-1 min-w-[160px]">
                <CardContent className=" space-y-4">
                  <div className="flex items-center gap-2">{logo}</div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Nombre d&apos;avis</p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">% d&apos;avis</p>
                      <p className="text-2xl font-bold">{percent}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Note moyenne</p>
                      <div className="flex items-center gap-1">
                        <StarIcon size={20} color="#FFD230" />
                        <span className="text-2xl font-bold">{avg.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href={reviewsUrl}>Voir les avis</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
