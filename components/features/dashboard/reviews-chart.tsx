"use client";

import { StarIcon } from "@/app/(landing)/components/star-icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import React, { useId } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

type MonthlyData = {
  month: string;
  avis: number;
  fullMonth: string;
  bySource: { trustpilot: number; google: number };
};

const chartConfig = {
  month: {
    label: "Mois",
  },
  avis: {
    label: "Nombre d'avis",
    color: "var(--chart-1)",
  },
};

type ReviewsChartProps = {
  data: MonthlyData[] | null;
  error: string | null;
};

export function ReviewsChart({ data, error }: ReviewsChartProps) {
  const gradientId = `reviews-chart-${useId().replace(/:/g, "")}`;

  if (!data && !error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Reviews evolution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold ">
            Reviews evolution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            {error ?? "No data available. Connect a review source to display the chart."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Reviews evolution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            accessibilityLayer
            data={data}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="var(--border)"
              opacity={0.5}
            />
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-avis)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-avis)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              padding={{ left: 0, right: 4 }}
            />
            <YAxis
              dataKey="avis"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              allowDecimals={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, _name, _item, _index, payload) => {
                    const data = payload as unknown as MonthlyData;
                    const items: { key: string; icon: React.ReactNode; count: number }[] = [];
                    if (data.bySource?.trustpilot > 0) {
                      items.push({
                        key: "trustpilot",
                        icon: <StarIcon size={14} color="#00b67a" />,
                        count: data.bySource.trustpilot,
                      });
                    }
                    if (data.bySource?.google > 0) {
                      items.push({
                        key: "google",
                        icon: <Image src="/images/google-icon.svg" alt="" width={14} height={14} className="object-contain" />,
                        count: data.bySource.google,
                      });
                    }
                    if (items.length === 0) return `${value} review`;
                    return (
                      <div className="space-y-1">
                        <div className="font-medium">{value} reviews</div>
                        <ul className="flex flex-col gap-1">
                          {items.map(({ key, icon, count }) => (
                            <li key={key} className="flex items-center gap-2 text-xs">
                              {icon}
                              <span>{count} review{count > 1 ? "s" : ""}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  }}
                />
              }
            />
            <Area
              dataKey="avis"
              type="natural"
              fill={`url(#${gradientId})`}
              fillOpacity={0.4}
              stroke="var(--color-avis)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
