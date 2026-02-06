"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Typography from "@/components/ui/typography";
import { getAll } from "@/lib/fetch";
import { cn } from "@/lib/utils";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Star,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { CountryDropdown } from "@/components/ui/country-dropdown";
import { countries } from "country-data-list";
import {
  reviewsColumns,
  type TrustpilotReview
} from "./reviews-columns";

interface ReviewsResponse {
  reviews: TrustpilotReview[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
  stats: {
    total: number;
    trustScore: number | null;
    distribution: Record<number, number>;
  };
  countries: string[];
}

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

const DEFAULT_STATS: ReviewsResponse["stats"] = {
  total: 0,
  trustScore: null,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
};

function StatsSection({ stats }: { stats?: ReviewsResponse["stats"] | null }) {
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
              className="object-contain dark:hidden"
            />
            <Image
              src="/images/trustpilot-logo-dark.svg"
              alt="Trustpilot"
              width={80}
              height={20}
              className="hidden object-contain dark:block"
            />
            <Badge variant="secondary">Trustpilot</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function TrustpilotReviewsList() {
  const [page, setPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [countryFilter, setCountryFilter] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    searchTimeoutRef.current = setTimeout(() => {
      setSearchDebounced(search);
      setPage(1);
    }, 300);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [search]);

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: [
      "trustpilot-reviews",
      page,
      ratingFilter,
      statusFilter,
      countryFilter,
      sortOrder,
      searchDebounced,
    ],
    queryFn: () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "15",
        sortOrder,
      });
      if (ratingFilter !== "all") params.set("rating", ratingFilter);
      if (statusFilter === "answered") params.set("status", "answered");
      if (statusFilter === "pending") params.set("status", "pending");
      if (countryFilter.length > 0) {
        const alpha2Codes = countryFilter
          .map((a3) => countries.all.find((c) => c.alpha3 === a3)?.alpha2)
          .filter(Boolean) as string[];
        if (alpha2Codes.length > 0)
          params.set("country", alpha2Codes.join(","));
      }
      if (searchDebounced) params.set("search", searchDebounced);
      return getAll<ReviewsResponse>(`/trustpilot/reviews?${params.toString()}`);
    },
    placeholderData: keepPreviousData,
  });

  // Initial load: no data at all - show full page skeleton
  const isInitialLoad = isLoading && !data;

  return (
    <div className="space-y-6">
      {isInitialLoad && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-[120px]" />
            ))}
          </div>
          <Skeleton className="h-[400px]" />
        </div>
      )}

      {!isInitialLoad && isError && (
        <Card className="border-destructive">
          <CardContent className="py-12 text-center">
            {error instanceof Error &&
              error.message.includes("No Trustpilot account") ? (
              <>
                <Typography variant="h3" className="mb-2">
                  No Trustpilot account connected
                </Typography>
                <Typography variant="description" className="mb-4">
                  Connect your Trustpilot account in the Connections page to
                  import your reviews.
                </Typography>
                <Button asChild>
                  <a href="/connections">Go to Connections</a>
                </Button>
              </>
            ) : (
              <Typography variant="p" className="text-destructive">
                Error: {error instanceof Error ? error.message : "Failed to load"}
              </Typography>
            )}
          </CardContent>
        </Card>
      )}

      {!isInitialLoad && !isError && data && (() => {
        const hasNoData = !data.reviews?.length;
        return (
          <>
            <StatsSection stats={data.stats} />

            <Card>
              <CardContent className="flex flex-col gap-4">

                {/* Tabs + Search + Filters */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <Tabs
                    value={statusFilter}
                    onValueChange={(v) => {
                      if (hasNoData) return;
                      setStatusFilter(v);
                      setPage(1);
                    }}
                  >
                    <TabsList>
                      <TabsTrigger value="all" disabled={hasNoData}>All</TabsTrigger>
                      <TabsTrigger value="pending" disabled={hasNoData}>To reply</TabsTrigger>
                      <TabsTrigger value="answered" disabled={hasNoData}>Answered</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <div className="flex flex-1 items-center gap-2 sm:justify-end">
                    <div className="relative flex-1 sm:max-w-sm">
                      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                        disabled={hasNoData}
                      />
                    </div>

                    <Select
                      value={ratingFilter}
                      onValueChange={(v) => {
                        setRatingFilter(v);
                        setPage(1);
                      }}
                    >
                      <SelectTrigger className="w-[130px]" disabled={hasNoData}>
                        <Filter className="size-4" />
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All ratings</SelectItem>
                        <SelectItem value="5">5 stars</SelectItem>
                        <SelectItem value="4">4 stars</SelectItem>
                        <SelectItem value="3">3 stars</SelectItem>
                        <SelectItem value="2">2 stars</SelectItem>
                        <SelectItem value="1">1 star</SelectItem>
                      </SelectContent>
                    </Select>

                    <CountryDropdown
                      placeholder="Select countries"
                      defaultValue={countryFilter}
                      onChange={() => {}}
                      onApply={(countries) => {
                        setCountryFilter(countries.map((c) => c.alpha3));
                        setPage(1);
                      }}
                      slim
                      multiple
                    />

                    <Select
                      value={sortOrder}
                      onValueChange={(v) => {
                        setSortOrder(v as "desc" | "asc");
                        setPage(1);
                      }}
                    >
                      <SelectTrigger className="w-[150px]" disabled={hasNoData}>
                        <SelectValue placeholder="Sort" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desc">Most recent</SelectItem>
                        <SelectItem value="asc">Oldest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Table - skeleton only when fetching new data (pagination, filters, etc.) */}
                {isFetching ? (
                  <>
                    <div className="overflow-hidden rounded-md border">
                      <div className="p-4 space-y-3">
                        {[...Array(10)].map((_, i) => (
                          <Skeleton key={i} className="h-12 w-full" />
                        ))}
                      </div>
                    </div>
                    {data.pagination.totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1 || isFetching}
                        >
                          <ChevronLeft className="size-4" />
                        </Button>
                        <Typography variant="description">
                          Page {page} of {data.pagination.totalPages}
                        </Typography>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            setPage((p) =>
                              Math.min(data.pagination.totalPages, p + 1)
                            )
                          }
                          disabled={page === data.pagination.totalPages || isFetching}
                        >
                          <ChevronRight className="size-4" />
                        </Button>
                      </div>
                    )}
                  </>
                ) : !data.reviews || data.reviews.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="py-12 flex flex-col items-center justify-center">
                      <Typography variant="h3" className="mb-2">
                        No reviews yet
                      </Typography>
                      <Typography variant="description">
                        {ratingFilter !== "all" ||
                          statusFilter !== "all" ||
                          countryFilter.length > 0
                          ? "No reviews match your filters."
                          : "Your Trustpilot reviews will appear here once synced."}
                      </Typography>
                      {ratingFilter === "all" &&
                        statusFilter === "all" &&
                        countryFilter.length === 0 && (
                          <Button asChild className="mt-4">
                            <a href="/connections">Go to Connections</a>
                          </Button>
                        )}
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <DataTable
                      columns={reviewsColumns}
                      data={data.reviews}
                      disablePagination
                    />

                    {/* Server-side pagination */}
                    {data.pagination.totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1}
                        >
                          <ChevronLeft className="size-4" />
                        </Button>
                        <Typography variant="description">
                          Page {page} of {data.pagination.totalPages}
                        </Typography>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            setPage((p) =>
                              Math.min(data.pagination.totalPages, p + 1)
                            )
                          }
                          disabled={page === data.pagination.totalPages}
                        >
                          <ChevronRight className="size-4" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </>
        );
      })()}
    </div>
  );
}

export default TrustpilotReviewsList;
