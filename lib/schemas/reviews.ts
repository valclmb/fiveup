/**
 * Zod schemas for reviews API: request bodies (QStash / internal) and GET query params.
 */

import { z } from "zod";

export const syncScheduledBodySchema = z.object({
  accountId: z.string().min(1, "accountId is required"),
});

export type SyncScheduledBody = z.infer<typeof syncScheduledBodySchema>;

export const sendReviewMessageBodySchema = z.object({
  orderReviewRequestId: z.string().min(1, "orderReviewRequestId is required"),
});

export type SendReviewMessageBody = z.infer<typeof sendReviewMessageBodySchema>;

/** GET /api/reviews query params (all optional; defaults applied in route). */
export const reviewsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  source: z.enum(["trustpilot", "google"]).optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  status: z.enum(["answered", "pending"]).optional(),
  country: z.string().max(500).optional(),
  search: z.string().max(200).optional(),
  sortBy: z.enum(["rating", "publishedAt"]).default("publishedAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ReviewsQuery = z.infer<typeof reviewsQuerySchema>;
