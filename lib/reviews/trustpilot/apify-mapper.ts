/**
 * Maps Apify dataset items to Prisma Review format
 */
import type { ApifyDatasetItem } from "@/lib/apify";

export function parseTrustpilotReviewFromApify(
  item: ApifyDatasetItem & { id: string; rating: number }
) {
  return {
    rating: item.rating,
    title: item.title ?? null,
    text: item.text ?? null,
    language: item.language ?? null,
    authorName: item.consumer?.displayName ?? null,
    authorImageUrl: item.consumer?.imageUrl ?? null,
    authorCountry: item.consumer?.countryCode ?? null,
    isVerified: item.labels?.verification?.isVerified ?? false,
    experiencedAt: item.dates?.experiencedDate
      ? new Date(item.dates.experiencedDate)
      : null,
    publishedAt: item.dates?.publishedDate
      ? new Date(item.dates.publishedDate)
      : null,
    replyText: item.reply?.message ?? null,
    replyPublishedAt: item.reply?.publishedDate
      ? new Date(item.reply.publishedDate)
      : null,
  };
}
