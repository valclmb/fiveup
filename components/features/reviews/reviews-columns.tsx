"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  CheckCircle,
  ChevronDown,
  ExternalLink,
  PenLine,
  Star
} from "lucide-react";

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

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      <Star
        className="size-4 fill-[#00b67a] text-[#00b67a]"

      />
    </div>
  );
}

export const reviewsColumns: ColumnDef<TrustpilotReview>[] = [
  {
    accessorKey: "authorName",
    header: "Client",
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
    accessorKey: "rating",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Note
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <span className="font-medium">{row.getValue("rating")}</span>
        <StarRating rating={row.getValue("rating")} />
      </div>
    ),
  },
  {
    accessorKey: "text",
    header: "Avis",
    cell: ({ row }) => {
      const MAX_CHARS = 150;
      const fullText = String(
        row.getValue("text") ?? row.original.title ?? "-"
      ).trim();
      const displayText =
        fullText.length > MAX_CHARS
          ? `${fullText.slice(0, MAX_CHARS)}...`
          : fullText;

      const replyText = row.original.replyText;
      const replyCount = replyText ? 1 : 0; // Trustpilot: 1 reply max per review

      const discussionContent = (
        <div className="max-h-[300px] space-y-3 overflow-y-auto text-left">
          <div>
            <p className="font-medium">Avis</p>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              {fullText}
            </p>
          </div>
          {replyCount > 0 && replyText && (
            <div>
              <p className="font-medium">
                Réponse{replyCount > 1 ? ` (${replyCount})` : ""}
              </p>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {String(replyText).trim()}
              </p>
            </div>
          )}
        </div>
      );

      return (
        <Popover>
          <PopoverTrigger
            className="group flex w-full  cursor-pointer items-center justify-between gap-3 rounded-md px-2 py-1 transition-colors border border-transparent hover:border-border hover:bg-muted"
            title="Cliquer pour voir la discussion"
          >
            <span className="min-w-0 flex-1 break-words whitespace-pre-wrap text-left leading-tight text-muted-foreground group-hover:text-foreground">
              {displayText}
            </span>
            <span className="flex shrink-0 items-center gap-1">
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
      );
    },
  },
  {
    id: "status",
    header: "Statut",
    cell: ({ row }) => {
      const hasReply = !!row.original.replyText;
      return hasReply ? (
        <Badge
          variant="outline"
          className="border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400"
        >
          <CheckCircle className="mr-1 size-3" />
          Répondu
        </Badge>
      ) : (
        <Badge
          variant="outline"
          className="border-orange-500/50 bg-orange-500/10 text-orange-700 dark:text-orange-400"
        >
          <PenLine className="mr-1 size-3" />
          A répondre
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
            Voir l&apos;avis
          </a>
        </Button>
      );
    },
  },
];
