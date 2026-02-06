"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Typography from "@/components/ui/typography";
import { getOne } from "@/lib/fetch";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ChevronLeft, Star } from "lucide-react";
import Link from "next/link";

import type { TrustpilotReview } from "./reviews-columns";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "size-5",
            star <= rating
              ? "fill-[#00b67a] text-[#00b67a]"
              : "fill-muted text-muted"
          )}
        />
      ))}
    </div>
  );
}

export function ReviewDetail({ id }: { id: string }) {
  const { data: review, isLoading, isError, error } = useQuery({
    queryKey: ["trustpilot-review", id],
    queryFn: async () => {
      const res = await getOne<TrustpilotReview | { error: string }>(
        "trustpilot/reviews",
        id
      );
      if (res && "error" in res) {
        throw new Error(res.error);
      }
      return res as TrustpilotReview;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 animate-pulse rounded bg-muted" />
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (isError || !review) {
    return (
      <Card className="border-destructive">
        <CardContent className="py-12 text-center">
          <Typography variant="p" className="text-destructive">
            {error instanceof Error ? error.message : "Avis non trouvé"}
          </Typography>
          <Button asChild className="mt-4">
            <Link href="/reviews">Retour aux avis</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const text = String(review.text ?? review.title ?? "-").trim();
  const replyText = review.replyText?.trim();
  const hasReply = !!replyText;

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/reviews" className="flex items-center gap-1">
          <ChevronLeft className="size-4" />
          Retour aux avis
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="size-12">
                {review.authorImageUrl ? (
                  <AvatarImage
                    src={review.authorImageUrl}
                    alt={review.authorName ?? "Avatar"}
                  />
                ) : null}
                <AvatarFallback>
                  {review.authorName
                    ? review.authorName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <Typography variant="h3" className="font-semibold">
                  {review.authorName ?? "Anonymous"}
                </Typography>
                {review.publishedAt && (
                  <Typography variant="description">
                    {format(new Date(review.publishedAt), "d MMMM yyyy")}
                  </Typography>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StarRating rating={review.rating} />
              <span className="font-medium">{review.rating}/5</span>
              {hasReply ? (
                <Badge
                  variant="outline"
                  className="border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400"
                >
                  Répondu
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="border-orange-500/50 bg-orange-500/10 text-orange-700 dark:text-orange-400"
                >
                  À répondre
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <CardTitle className="mb-2 text-sm font-medium">Avis</CardTitle>
            <p className="whitespace-pre-wrap text-muted-foreground">{text}</p>
          </div>

          {hasReply && replyText && (
            <div>
              <CardTitle className="mb-2 text-sm font-medium">
                Réponse de l&apos;entreprise
                {review.replyPublishedAt && (
                  <span className="ml-2 font-normal text-muted-foreground">
                    ({format(new Date(review.replyPublishedAt), "d MMM yyyy")})
                  </span>
                )}
              </CardTitle>
              <p className="whitespace-pre-wrap rounded-lg bg-muted/50 p-4 text-muted-foreground">
                {replyText}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
