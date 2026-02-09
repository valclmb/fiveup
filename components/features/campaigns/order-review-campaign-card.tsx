"use client";

import { valueAndUnitToHours } from "@/lib/campaigns";
import { deleteOne, getAll, patch } from "@/lib/fetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { CampaignCard } from "./campaign-card";
import {
  CampaignConfigForm,
  type CampaignConfigFormValues,
} from "./campaign-config-form";
import { CampaignSkeleton } from "./campaign-skeleton";
import { CampaignSummaryTags } from "./campaign-summary-tags";
import { NoStoreCard } from "./no-store-card";

export type OrderReviewCampaignResponse = {
  userCampaign: {
    status?: string;
    delayHours: number;
    channel: string;
    messageContent: string | null;
    thanksMessageEnabled?: boolean;
    thanksMessageContent: string | null;
    triggerType?: string;
  } | null;
  storeId: string | null;
  hasStore: boolean;
};

export function OrderReviewCampaignCard() {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["campaign", "order-review-request"],
    queryFn: () =>
      getAll<OrderReviewCampaignResponse>("campaigns/order-review-request"),
  });

  const patchMutation = useMutation({
    mutationFn: async (payload: {
      status?: "active" | "paused";
      triggerType?: "purchase" | "shipment" | "receipt";
      delayHours?: number;
      channel?: string;
      messageContent?: string;
      thanksMessageEnabled?: boolean;
      thanksMessageContent?: string;
    }) => {
      const res = await patch("campaigns/order-review-request", payload);
      if (res?.error) throw new Error(res.error);
      return res;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["campaign", "order-review-request"],
      });
      if (variables.status === "active") {
        toast.success("Campaign activated");
      } else if (
        variables.triggerType !== undefined ||
        variables.delayHours !== undefined ||
        variables.channel !== undefined ||
        variables.messageContent !== undefined ||
        variables.thanksMessageEnabled !== undefined ||
        variables.thanksMessageContent !== undefined
      ) {
        toast.success("Campaign saved");
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await deleteOne("campaigns/order-review-request", "");
      if (res?.error) throw new Error(res.error);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["campaign", "order-review-request"],
      });
      toast.success("Campaign deactivated");
    },
  });

  const userCampaign = data?.userCampaign;
  const hasStore = data?.hasStore ?? false;
  const isActive = userCampaign?.status === "active";

  const handleSwitchChange = async (checked: boolean) => {
    if (!hasStore) return;
    if (checked) {
      await patchMutation.mutateAsync({ status: "active" });
    } else {
      await deleteMutation.mutateAsync();
    }
  };

  if (isLoading) return <CampaignSkeleton />;
  if (!hasStore) return <NoStoreCard />;

  const handleSaveConfig = async (
    formData: CampaignConfigFormValues,
    closeDrawer: () => void
  ) => {
    const delayHours = valueAndUnitToHours(
      formData.delayValue,
      formData.delayUnit
    );
    await patchMutation.mutateAsync({
      triggerType: formData.triggerType,
      delayHours,
      channel: formData.channel,
      messageContent: formData.messageContent,
      thanksMessageEnabled: formData.thanksMessageEnabled,
      thanksMessageContent: formData.thanksMessageContent,
    });
    closeDrawer();
  };

  return (
    <CampaignCard
      title="Review after purchases"
      description="Automatically send a review request after a purchase."
      isActive={isActive}
      onSwitchChange={handleSwitchChange}
      isSwitchDisabled={patchMutation.isPending || deleteMutation.isPending}
      summaryTags={
        userCampaign ? (
          <CampaignSummaryTags
            delayHours={userCampaign.delayHours}
            triggerType={userCampaign.triggerType}
            channel={userCampaign.channel}
          />
        ) : undefined
      }
      drawerTitle="Configure campaign"
      drawerContent={({ closeDrawer }) => (
        <CampaignConfigForm
          userCampaign={userCampaign ?? null}
          step={step}
          onStepChange={setStep}
          onSave={(data) => handleSaveConfig(data, closeDrawer)}
          isSaving={patchMutation.isPending}
        />
      )}
    />
  );
}
