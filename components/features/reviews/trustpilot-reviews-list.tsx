"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Filter, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { CountryDropdown } from "@/components/ui/country-dropdown";
import { countries } from "country-data-list";
import {
  reviewsColumns,
  type TrustpilotReview
} from "./reviews-columns";
import { ReviewsStatsSection } from "./reviews-stats-section";

/** Returns page numbers and ellipsis to display (e.g. [1, "ellipsis", 4, 5, 6, "ellipsis", 10]) */
function getPaginationItems(page: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const items: (number | "ellipsis")[] = [1];
  if (page > 3) items.push("ellipsis");
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  for (let i = start; i <= end; i++) {
    items.push(i);
  }
  if (page < totalPages - 2) items.push("ellipsis");
  if (totalPages > 1 && items[items.length - 1] !== totalPages) items.push(totalPages);
  return items;
}

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
            <ReviewsStatsSection stats={data.stats} />

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
                      onChange={() => { }}
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
                      <Pagination className="justify-end">
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              href="#"
                              aria-disabled={page === 1 || isFetching}
                              className={page === 1 || isFetching ? "pointer-events-none opacity-50" : ""}
                              onClick={(e) => {
                                e.preventDefault();
                                if (page === 1 || isFetching) return;
                                setPage((p) => Math.max(1, p - 1));
                              }}
                            />
                          </PaginationItem>
                          {getPaginationItems(page, data.pagination.totalPages).map((item, i) =>
                            item === "ellipsis" ? (
                              <PaginationItem key={`ellipsis-${i}`}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            ) : (
                              <PaginationItem key={item}>
                                <PaginationLink
                                  href="#"
                                  isActive={page === item}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (isFetching) return;
                                    setPage(item);
                                  }}
                                >
                                  {item}
                                </PaginationLink>
                              </PaginationItem>
                            )
                          )}
                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              aria-disabled={page === data.pagination.totalPages || isFetching}
                              className={page === data.pagination.totalPages || isFetching ? "pointer-events-none opacity-50" : ""}
                              onClick={(e) => {
                                e.preventDefault();
                                if (page === data.pagination.totalPages || isFetching) return;
                                setPage((p) => Math.min(data.pagination.totalPages, p + 1));
                              }}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
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
                      <Pagination className="justify-end">
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              href="#"
                              aria-disabled={page === 1}
                              className={page === 1 ? "pointer-events-none opacity-50" : ""}
                              onClick={(e) => {
                                e.preventDefault();
                                if (page === 1) return;
                                setPage((p) => Math.max(1, p - 1));
                              }}
                            />
                          </PaginationItem>
                          {getPaginationItems(page, data.pagination.totalPages).map((item, i) =>
                            item === "ellipsis" ? (
                              <PaginationItem key={`ellipsis-${i}`}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            ) : (
                              <PaginationItem key={item}>
                                <PaginationLink
                                  href="#"
                                  isActive={page === item}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setPage(item);
                                  }}
                                >
                                  {item}
                                </PaginationLink>
                              </PaginationItem>
                            )
                          )}
                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              aria-disabled={page === data.pagination.totalPages}
                              className={page === data.pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                              onClick={(e) => {
                                e.preventDefault();
                                if (page === data.pagination.totalPages) return;
                                setPage((p) => Math.min(data.pagination.totalPages, p + 1));
                              }}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
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
