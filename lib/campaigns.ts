import type { LucideIcon } from "lucide-react";
import { Package, ShoppingBag, Truck } from "lucide-react";

/**
 * Campaign definitions - defined in code, listed on front.
 * UserCampaign stores the user's config (delay, channel, messageContent, etc.)
 */

export const ORDER_REVIEW_REQUEST_SLUG = "order_review_request" as const;

export type CampaignSlug = typeof ORDER_REVIEW_REQUEST_SLUG;

export interface CampaignDefinition {
  slug: CampaignSlug;
  name: string;
  description: string;
  triggerType: string;
}

/** Campaigns available for activation. Used by front to list + UserCampaign to resolve config. */
export const CAMPAIGNS: CampaignDefinition[] = [
  {
    slug: ORDER_REVIEW_REQUEST_SLUG,
    name: "Post-purchase review request",
    description:
      "With each new Shopify order, send a message (WhatsApp, SMS or email) to the customer after a configurable delay, with the personalized review collection link.",
    triggerType: "shopify_order",
  },
];

export function getCampaignBySlug(slug: string): CampaignDefinition | undefined {
  return CAMPAIGNS.find((c) => c.slug === slug);
}

/** Message variables for order_review_request campaign. */
export const MESSAGE_VARIABLES = [
  { key: "{{customer_first_name}}", label: "Customer first name" },
  { key: "{{customer_last_name}}", label: "Customer last name" },
  { key: "{{order_number}}", label: "Order number" },
  { key: "{{review_link}}", label: "Review collection link" },
] as const;

export const DELAY_UNITS = [
  { value: "hours", label: "Hours" },
  { value: "days", label: "Days" },
  { value: "weeks", label: "Weeks" },
] as const;

export const CHANNELS = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "whatsapp", label: "WhatsApp" },
] as const;

/** Shopify webhook trigger: when to send the review request. */
export const TRIGGER_TYPES = [
  { value: "purchase", label: "On purchase", webhook: "orders/create" },
  { value: "shipment", label: "On shipment", webhook: "orders/fulfilled" },
  { value: "receipt", label: "On receipt", webhook: "orders/fulfilled" },
] as const;

export type TriggerType = (typeof TRIGGER_TYPES)[number]["value"];
export type ChannelValue = (typeof CHANNELS)[number]["value"];

export const TRIGGER_ICONS: Record<TriggerType, LucideIcon> = {
  purchase: ShoppingBag,
  shipment: Truck,
  receipt: Package,
};

/** Delay value options for select. */
export const DELAY_VALUES = {
  hours: [1, 2, 3, 4, 5, 6, 12, 24, 48, 72] as const,
  days: [1, 2, 3, 4, 5, 6, 7] as const,
  weeks: [1, 2, 3, 4] as const,
} as const;

function closestInArray(arr: readonly number[], value: number): number {
  return arr.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  );
}

export function hoursToValueAndUnit(hours: number): {
  value: number;
  unit: "hours" | "days" | "weeks";
} {
  const weeksVal = hours / 168;
  const daysVal = hours / 24;
  if (weeksVal >= 1 && weeksVal <= 4) {
    return {
      value: Math.round(closestInArray([...DELAY_VALUES.weeks], weeksVal)),
      unit: "weeks",
    };
  }
  if (daysVal >= 1 && daysVal <= 7) {
    return {
      value: Math.round(closestInArray([...DELAY_VALUES.days], daysVal)),
      unit: "days",
    };
  }
  return {
    value: closestInArray([...DELAY_VALUES.hours], hours),
    unit: "hours",
  };
}

export function valueAndUnitToHours(
  value: number,
  unit: "hours" | "days" | "weeks"
): number {
  if (unit === "weeks") return value * 168;
  if (unit === "days") return value * 24;
  return value;
}

