/**
 * Zod schemas for campaigns API request bodies.
 * Used only on the server; form components use their own schema (e.g. delayValue/delayUnit vs delayHours).
 */

import { z } from "zod";

const channelSchema = z.enum(["email", "sms", "whatsapp"]);
const triggerTypeSchema = z.enum(["purchase", "shipment", "receipt"]);
const statusSchema = z.enum(["active", "inactive"]);

export const orderReviewRequestPatchSchema = z.object({
  status: statusSchema.optional(),
  triggerType: triggerTypeSchema.optional(),
  delayHours: z.number().int().min(0).max(720).optional(), // 0–720 hours (30 days)
  channel: channelSchema.optional(),
  messageContent: z.string().max(10_000).optional(),
  thanksMessageEnabled: z.boolean().optional(),
  thanksMessageContent: z.string().max(5_000).optional(),
});

export type OrderReviewRequestPatchBody = z.infer<typeof orderReviewRequestPatchSchema>;
