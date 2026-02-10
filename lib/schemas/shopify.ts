/**
 * Zod schemas for Shopify API request bodies and webhook payloads.
 */

import { z } from "zod";

export const shopifyDisconnectPostSchema = z.object({
  storeId: z.string().min(1, "Store ID is required"),
});

export type ShopifyDisconnectPostBody = z.infer<typeof shopifyDisconnectPostSchema>;

/** Minimal shape for Shopify order webhook (orders/create, orders/fulfilled). Validates only fields we use. */
const shopifyAddressSchema = z
  .object({
    first_name: z.string().nullable().optional(),
    last_name: z.string().nullable().optional(),
    address1: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    country: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
  })
  .optional();

const shopifyCustomerSchema = z
  .object({
    id: z.number(),
    email: z.string().nullable().optional(),
    first_name: z.string().nullable().optional(),
    last_name: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
  })
  .optional();

const shopifyLineItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  quantity: z.number(),
  price: z.string(),
  product_id: z.number(),
});

export const shopifyWebhookOrderSchema = z.object({
  id: z.number(),
  name: z.string(),
  order_number: z.number(),
  email: z.string().optional(),
  phone: z.string().nullable().optional(),
  created_at: z.string(),
  total_price: z.string(),
  currency: z.string(),
  fulfillment_status: z.string().nullable().optional(),
  financial_status: z.string(),
  customer: shopifyCustomerSchema,
  line_items: z.array(shopifyLineItemSchema),
  billing_address: shopifyAddressSchema,
  shipping_address: shopifyAddressSchema,
});

export type ShopifyWebhookOrder = z.infer<typeof shopifyWebhookOrderSchema>;
