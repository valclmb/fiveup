"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import Typography from "@/components/ui/typography";
import { getAll } from "@/lib/fetch";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Star,
} from "lucide-react";
import { useState } from "react";

interface TrustpilotReview {
  id: string;
  trustpilotId: string;
  rating: number;
  title: string | null;
  text: string | null;
  language: string | null;
  authorName: string | null;
  authorCountry: string | null;
  isVerified: boolean;
  experiencedAt: string | null;
  publishedAt: string | null;
  replyText: string | null;
  replyPublishedAt: string | null;
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
    distribution: Record<number, number>;
  };
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

function ReviewCard({ review }: { review: TrustpilotReview }) {
  return (
    <Card className="h-full">
      <CardContent className="pt-4">
        <div className="space-y-3">
          {/* Header: Rating + Date */}
          <div className="flex items-center justify-between">
            <StarRating rating={review.rating} />
            {review.publishedAt && (
              <Typography variant="description" className="text-xs">
                {formatDistanceToNow(new Date(review.publishedAt), {
                  addSuffix: true,
                  locale: fr,
                })}
              </Typography>
            )}
          </div>

          {/* Title */}
          {review.title && (
            <Typography variant="p" className="font-semibold line-clamp-1">
              {review.title}
            </Typography>
          )}

          {/* Text */}
          {review.text && (
            <Typography variant="description" className="line-clamp-3">
              {review.text}
            </Typography>
          )}

          {/* Author */}
          <div className="flex items-center gap-2 pt-2 border-t">
            <div className="size-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
              {review.authorName?.charAt(0)?.toUpperCase() ?? "?"}
            </div>
            <div className="flex-1 min-w-0">
              <Typography variant="p" className="text-sm font-medium truncate">
                {review.authorName ?? "Anonymous"}
              </Typography>
              {review.authorCountry && (
                <Typography variant="description" className="text-xs">
                  {review.authorCountry}
                </Typography>
              )}
            </div>
            {review.isVerified && (
              <Badge variant="outline" className="text-xs gap-1 shrink-0">
                <CheckCircle className="size-3 text-[#00b67a]" />
                Vérifié
              </Badge>
            )}
          </div>

          {/* Reply */}
          {review.replyText && (
            <div className="mt-3 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="size-4 text-muted-foreground" />
                <Typography variant="description" className="text-xs font-medium">
                  Réponse de l'entreprise
                </Typography>
              </div>
              <Typography variant="description" className="text-sm line-clamp-2">
                {review.replyText}
              </Typography>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StatsCard({ stats }: { stats: ReviewsResponse["stats"] }) {
  const avgRating =
    stats.total > 0
      ? Object.entries(stats.distribution).reduce(
          (acc, [rating, count]) => acc + Number(rating) * count,
          0
        ) / stats.total
      : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold">{avgRating.toFixed(1)}</div>
          <div className="flex flex-col gap-1">
            <StarRating rating={Math.round(avgRating)} />
            <Typography variant="description">
              {stats.total} avis total
            </Typography>
          </div>
        </div>

        {/* Distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = stats.distribution[rating] ?? 0;
            const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
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
                <span className="w-12 text-right text-muted-foreground">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export function TrustpilotReviewsList() {
  const [page, setPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["trustpilot-reviews", page, ratingFilter, sortOrder],
    queryFn: () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        sortOrder,
      });
      if (ratingFilter !== "all") {
        params.set("rating", ratingFilter);
      }
      return getAll<ReviewsResponse>(`/trustpilot/reviews?${params.toString()}`);
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-[200px]" />
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[200px]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to load reviews";

    // Check if it's a "no account" error
    if (errorMessage.includes("No Trustpilot account")) {
      return (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Typography variant="h3" className="mb-2">
              No Trustpilot account connected
            </Typography>
            <Typography variant="description" className="mb-4">
              Connect your Trustpilot account in the Connections page to import
              your reviews.
            </Typography>
            <Button asChild>
              <a href="/connections">Go to Connections</a>
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="border-destructive">
        <CardContent className="py-6 text-center">
          <Typography variant="p" className="text-destructive">
            Error: {errorMessage}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.reviews || data.reviews.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          <Typography variant="h3" className="mb-2">
            No reviews yet
          </Typography>
          <Typography variant="description">
            {ratingFilter !== "all"
              ? `No ${ratingFilter}-star reviews found. Try changing the filter.`
              : "Your Trustpilot reviews will appear here once synced."}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const { reviews, pagination, stats } = data;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by rating" />
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

        <Select
          value={sortOrder}
          onValueChange={(v) => setSortOrder(v as "desc" | "asc")}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Sort order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Newest first</SelectItem>
            <SelectItem value="asc">Oldest first</SelectItem>
          </SelectContent>
        </Select>

        <Typography variant="description" className="ml-auto">
          {pagination.totalCount} reviews
        </Typography>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Stats */}
        <div className="md:col-span-1">
          <StatsCard stats={stats} />
        </div>

        {/* Reviews Grid */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
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
            Page {page} of {pagination.totalPages}
          </Typography>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default TrustpilotReviewsList;
