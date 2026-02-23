"use client";

import { StarIcon, StarIcons } from "@/components/custom-ui/star-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import Link from "next/link";

export type RecentReview = {
  id: string;
  authorName: string;
  authorImageUrl: string | null;
  rating: number;
  source: "TRUSTPILOT" | "GOOGLE";
  reviewUrl: string | null;
};

export function RecentReviews({ reviews }: { reviews: RecentReview[] }) {
  if (reviews.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold">Avis récents</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm py-4">
            Aucun avis pour le moment. Connectez une source d'avis pour afficher vos avis.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">Avis récents</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/reviews">Voir tout</Link>
        </Button>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarImage src={review.authorImageUrl ?? undefined} alt={review.authorName} />
                      <AvatarFallback className="text-xs">
                        {review.authorName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{review.authorName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{review.rating}</span>
                    <StarIcons size={16} starsFilled={review.rating} color="#FFD230" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {review.source === "GOOGLE" ? (
                      <>
                        <Image
                          src="/images/google-icon.svg"
                          alt="Google"
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                        <span>Google</span>
                      </>
                    ) : (
                      <>
                        <StarIcon size={20} color="#00b67a" />
                        <span>Trustpilot</span>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
