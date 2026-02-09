"use client";

import {
  DelayedDeliveryCard,
  LoyalCustomerCard,
  LongDeliveryReassuranceCard,
  OrderReviewCampaignCard,
  WhatsAppMarketingCard,
} from "@/components/features/campaigns";

export default function CampaignsPage() {
  return (
    <div className="flex flex-wrap gap-6">
      <OrderReviewCampaignCard />
      <DelayedDeliveryCard />
      <WhatsAppMarketingCard />
      <LongDeliveryReassuranceCard />
      <LoyalCustomerCard />
    </div>
  );
}