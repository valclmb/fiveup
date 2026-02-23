"use client";

import {
  CampaignSkeleton,
  DelayedDeliveryCard,
  LoyalCustomerCard,
  LongDeliveryReassuranceCard,
  NoStoreCard,
  OrderReviewCampaignCard,
  WhatsAppMarketingCard,
} from "@/components/features/campaigns";
import { getAll } from "@/lib/fetch";
import { useQuery } from "@tanstack/react-query";

type CampaignResponse = {
  hasStore: boolean;
};

export default function CampaignsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["campaign", "order-review-request"],
    queryFn: () => getAll<CampaignResponse>("campaigns/order-review-request"),
  });

  const hasStore = data?.hasStore ?? false;

  if (isLoading) return <CampaignSkeleton />;
  if (!hasStore) return <NoStoreCard />;

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