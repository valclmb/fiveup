/**
 * API request body schemas (Zod). Use safeParse() on the server and return 400 when validation fails.
 * Kept in lib/ (not in components/features) so routes stay server-only and form shapes can differ from API payloads.
 */

export {
  orderReviewRequestPatchSchema,
  type OrderReviewRequestPatchBody,
} from "./campaigns";

export {
  feedbackPagePatchSchema,
  globalStylesPatchSchema,
  redirectionPagePatchSchema,
  reviewPagePatchSchema,
  type FeedbackPagePatchBody,
  type GlobalStylesPatchBody,
  type RedirectionPagePatchBody,
  type ReviewPagePatchBody,
} from "./customization";

export { feedbackPostSchema, type FeedbackPostBody } from "./feedback";

export {
  shopifyDisconnectPostSchema,
  shopifyWebhookOrderSchema,
  type ShopifyDisconnectPostBody,
  type ShopifyWebhookOrder,
} from "./shopify";

export {
  reviewsQuerySchema,
  sendReviewMessageBodySchema,
  syncScheduledBodySchema,
  type ReviewsQuery,
  type SendReviewMessageBody,
  type SyncScheduledBody,
} from "./reviews";
