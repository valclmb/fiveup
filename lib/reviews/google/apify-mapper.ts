/**
 * Maps Apify Google Maps Reviews Scraper output to Prisma Review format
 * @see google-sample.json for input structure
 */

export interface GoogleReviewItem {
  reviewId: string;
  stars: number;
  name: string;
  reviewerPhotoUrl?: string;
  text?: string;
  publishedAtDate?: string;
  responseFromOwnerText?: string | null;
  responseFromOwnerDate?: string | null;
  originalLanguage?: string;
  countryCode?: string;
  isLocalGuide?: boolean;
  reviewUrl?: string;
  reviewImageUrls?: string[];
  textTranslated?: string;
  likesCount?: number;
  reviewerNumberOfReviews?: number;
  visitedIn?: string;
  // Place-level fields (present in each review item)
  placeId?: string;
  title?: string;
  totalScore?: number;
  reviewsCount?: number;
  url?: string;
  imageUrl?: string;
  address?: string;
}

export function parseGoogleReviewFromApify(item: GoogleReviewItem) {
  return {
    sourceId: item.reviewId,
    rating: item.stars,
    title: null, // Google reviews don't have a title
    text: item.text ?? null,
    language: item.originalLanguage ?? null,
    authorName: item.name ?? null,
    authorImageUrl: item.reviewerPhotoUrl ?? null,
    authorCountry: item.countryCode ?? null,
    isVerified: item.isLocalGuide ?? false,
    experiencedAt: null, // Google has "visitedIn" as string, not precise date
    publishedAt: item.publishedAtDate ? new Date(item.publishedAtDate) : null,
    replyText: item.responseFromOwnerText ?? null,
    replyPublishedAt: item.responseFromOwnerDate
      ? new Date(item.responseFromOwnerDate)
      : null,
    reviewUrl: item.reviewUrl ?? null,
    sourceMetadata: {
      reviewImageUrls: item.reviewImageUrls ?? [],
      textTranslated: item.textTranslated ?? null,
      likesCount: item.likesCount ?? 0,
      reviewerNumberOfReviews: item.reviewerNumberOfReviews ?? 0,
      visitedIn: item.visitedIn ?? null,
    },
  };
}
