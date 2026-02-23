/**
 * Zod schemas for customization API request bodies (feedback page, global styles, redirection, review page).
 */

import { hexColorSchema } from "@/lib/hex-color-schema";
import { z } from "zod";

const togglableSchema = z.object({
  enabled: z.boolean(),
  content: z.string().max(2_000),
});

export const feedbackPagePatchSchema = z.object({
  title: z.string().max(500).optional(),
  helpText: togglableSchema.optional(),
  reviewTag: togglableSchema.optional(),
  reviewTagOptions: z.array(z.string().max(200)).max(5).optional(),
  reviewTitle: togglableSchema.optional(),
  reviewComment: togglableSchema.optional(),
});

export type FeedbackPagePatchBody = z.infer<typeof feedbackPagePatchSchema>;

const fontSchema = z.enum(["inter", "dm-sans", "fraunces", "outfit", "lora"]);
const cornerRoundnessSchema = z.enum(["none", "sm", "md", "lg", "rounded"]);

export const globalStylesPatchSchema = z.object({
  font: fontSchema.optional(),
  cornerRoundness: cornerRoundnessSchema.optional(),
  buttonCornerRoundness: cornerRoundnessSchema.optional(),
  borderColor: hexColorSchema.optional(),
  buttonBgColor: hexColorSchema.optional(),
  buttonTextColor: hexColorSchema.optional(),
  starsColor: hexColorSchema.optional(),
  bgColor: hexColorSchema.optional(),
  textColor: hexColorSchema.optional(),
  cardColor: hexColorSchema.optional(),
});

export type GlobalStylesPatchBody = z.infer<typeof globalStylesPatchSchema>;

const descriptionSchema = z.object({
  enabled: z.boolean(),
  content: z.string().max(2_000),
});

export const redirectionPagePatchSchema = z.object({
  title: z.string().max(500).optional(),
  buttonText: z.string().max(200).optional(),
  description: descriptionSchema.optional(),
});

export type RedirectionPagePatchBody = z.infer<typeof redirectionPagePatchSchema>;

export const reviewPagePatchSchema = z.object({
  title: z.string().max(500).optional(),
  ratingTemplate: z.enum(["arc-stars", "classic"]).optional(),
  buttonText: z.string().max(200).optional(),
});

export type ReviewPagePatchBody = z.infer<typeof reviewPagePatchSchema>;
