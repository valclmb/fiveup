/**
 * Zod schemas for feedback API request bodies.
 */

import { z } from "zod";

export const feedbackPostSchema = z.object({
  message: z
    .string()
    .max(1024, "Message too long")
    .transform((s) => s.trim())
    .pipe(z.string().min(1, "Message is required")),
  pageUrl: z
    .string()
    .max(2048, "Page URL too long")
    .transform((s) => s.trim())
    .pipe(z.string().min(1, "Page URL is required")),
});

export type FeedbackPostBody = z.infer<typeof feedbackPostSchema>;
