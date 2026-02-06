"use client";

import { StarIcon } from "@/app/(landing)/components/star-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  ArrowUpDown,
  CheckCircle,
  ChevronDown,
  ExternalLink,
  PenLine,
  Star,
} from "lucide-react";

/** Convert ISO country code (e.g. FR, GB) to emoji flag - exported for filter */
export function countryCodeToFlag(code: string | null): string {
  if (!code || code.length !== 2) return "";
  return code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0)))
    .join("");
}

export interface TrustpilotReview {
  id: string;
  trustpilotId: string;
  rating: number;
  title: string | null;
  text: string | null;
  language: string | null;
  authorName: string | null;
  authorImageUrl: string | null;
  authorCountry: string | null;
  isVerified: boolean;
  experiencedAt: string | null;
  publishedAt: string | null;
  replyText: string | null;
  replyPublishedAt: string | null;
  reviewUrl?: string; // URL directe Trustpilot de l'avis (https://www.trustpilot.com/reviews/{trustpilotId})
}



export const reviewsColumns: ColumnDef<TrustpilotReview>[] = [
  {
    accessorKey: "authorName",
    header: "Customer",
    cell: ({ row }) => {
      const name: string = String(row.getValue("authorName") ?? "Anonymous");
      const imageUrl = row.original.authorImageUrl;
      const initials = row.original.authorName
        ? String(row.original.authorName)
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
        : "?";
      return (
        <div className="flex items-center gap-2">
          <Avatar className="size-6">
            {imageUrl ? <AvatarImage src={imageUrl} alt={String(name)} /> : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "authorCountry",
    header: "Country",
    cell: ({ row }) => {
      const country = row.original.authorCountry;
      if (!country) return <span className="text-muted-foreground">-</span>;
      const flag = countryCodeToFlag(country);
      return (
        <span className="flex items-center gap-1.5">
          {flag && <span className="text-lg leading-none">{flag}</span>}
          <span>{country}</span>
        </span>
      );
    },
  },
  {
    accessorKey: "rating",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Rating
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-md font-bold ">
        {row.getValue("rating")}
        <StarIcon
          size={20}

        />


      </div>
    ),
  },
  {
    accessorKey: "text",
    header: "Review",
    cell: ({ row }) => {
      const MAX_CHARS = 150;
      const title = row.original.title?.trim();
      const text = String(row.getValue("text") ?? "").trim();
      const displayText =
        text.length > MAX_CHARS ? `${text.slice(0, MAX_CHARS)}...` : text || "-";

      const isVerified = row.original.isVerified;

      const replyText = row.original.replyText;
      const replyCount = replyText ? 1 : 0;
      const publishedAt = row.original.publishedAt;
      const replyPublishedAt = row.original.replyPublishedAt;

      const discussionContent = (
        <div className="max-h-[300px] space-y-4 overflow-y-auto text-left">
          <div>
            <div className="mb-1 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <p className="font-medium">Review</p>
                {isVerified && (
                  <Badge variant="outline" className="gap-1 px-1.5 py-0 text-xs">
                    <Star className="size-3 fill-[#00b67a] text-[#00b67a]" />
                    Verified review
                  </Badge>
                )}
              </div>
              {publishedAt && (
                <span className="text-xs text-muted-foreground shrink-0">
                  {format(new Date(publishedAt), "d MMM yyyy")}
                </span>
              )}
            </div>
            {title && (
              <p className="mb-2 font-semibold text-foreground">{title}</p>
            )}
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              {text || "-"}
            </p>
          </div>
          {replyCount > 0 && replyText && (
            <div>
              <div className="mb-1 flex items-center justify-between">
                <p className="font-medium">
                  Reply{replyCount > 1 ? ` (${replyCount})` : ""}
                </p>
                {replyPublishedAt && (
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(replyPublishedAt), "d MMM yyyy")}
                  </span>
                )}
              </div>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {String(replyText).trim()}
              </p>
            </div>
          )}
        </div>
      );

      return (
        <div className="min-w-[380px] overflow-visible">
          <Popover>
            <PopoverTrigger
              className="group  flex w-full min-w-0 cursor-pointer items-center justify-between gap-3 rounded-md p-2 transition-colors  hover:bg-muted"
              title="Click to view discussion"
            >
              <span className="min-w-0 flex-1 overflow-visible break-words whitespace-pre-wrap text-left leading-tight text-muted-foreground group-hover:text-foreground">
                {title ? (
                  <>
                    <span className="font-semibold text-foreground space-x-1">{title}</span>
                    {text && (
                      <>
                        {"\n"}
                        <span>{displayText}</span>
                      </>
                    )}
                  </>
                ) : (
                  displayText
                )}
              </span>
              <span className="flex shrink-0 items-center gap-1">
                {isVerified && (
                  <Badge variant="outline" className="gap-1 px-1.5 py-0 text-xs">
                    <Star className="size-3 fill-[#00b67a] text-[#00b67a]" />
                    Verified review
                  </Badge>
                )}
                <ChevronDown
                  className="size-4 shrink-0 text-muted-foreground opacity-50 transition-opacity group-hover:opacity-100"
                  aria-hidden
                />
              </span>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-96 max-w-[90vw] p-4">
              {discussionContent}
            </PopoverContent>
          </Popover>
        </div>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const hasReply = !!row.original.replyText;
      return hasReply ? (
        <Badge
          variant="outline"
          className="border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400"
        >
          <CheckCircle className="mr-1 size-3" />
          Answered
        </Badge>
      ) : (
        <Badge
          variant="outline"
          className="border-orange-500/50 bg-orange-500/10 text-orange-700 dark:text-orange-400"
        >
          <PenLine className="mr-1 size-3" />
          To reply
        </Badge>
      );
    },
  },
  {
    id: "view",
    header: "",
    cell: ({ row }) => {
      const reviewUrl =
        row.original.reviewUrl ??
        `https://www.trustpilot.com/reviews/${row.original.trustpilotId}`;
      return (
        <Button variant="outline" size="sm" asChild>
          <a
            href={reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5"
          >
            <ExternalLink className="size-4" />
            View review
          </a>
        </Button>
      );
    },
  },
];
