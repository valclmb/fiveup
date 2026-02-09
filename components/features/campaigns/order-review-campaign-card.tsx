"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import Typography from "@/components/ui/typography";
import { valueAndUnitToHours } from "@/lib/campaigns";
import { deleteOne, getAll, patch } from "@/lib/fetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
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
    triggerType?: string;
  } | null;
  storeId: string | null;
  hasStore: boolean;
};

export function OrderReviewCampaignCard() {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
        variables.messageContent !== undefined
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

  const handleSaveConfig = async (formData: CampaignConfigFormValues) => {
    const delayHours = valueAndUnitToHours(
      formData.delayValue,
      formData.delayUnit
    );
    await patchMutation.mutateAsync({
      triggerType: formData.triggerType,
      delayHours,
      channel: formData.channel,
      messageContent: formData.messageContent,
    });
    setDrawerOpen(false);
  };

  if (isLoading) return <CampaignSkeleton />;
  if (!hasStore) return <NoStoreCard />;

  return (
    <Card className="max-w-4xl">
      <CardContent className="p-6">
        <section className="flex items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2
            ">
              <Switch
                id="campaign-switch"
                checked={isActive}
                onCheckedChange={handleSwitchChange}
                disabled={patchMutation.isPending || deleteMutation.isPending}
              />
              <Label htmlFor="campaign-switch">Review after purchases</Label>
            </div>
            <Typography variant="description" affects="muted">
              Automatically send a review request after a purchase.
            </Typography>
            {isActive && userCampaign && (
              <CampaignSummaryTags
                delayHours={userCampaign.delayHours}
                triggerType={userCampaign.triggerType}
                channel={userCampaign.channel}
              />
            )}
          </div>
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction="right">
            <DrawerTrigger asChild>
              <Button variant="outline" disabled={!isActive}>
                Configure campaign
              </Button>
            </DrawerTrigger>

            <DrawerContent className="min-w-xl p-8">
              <DrawerHeader className="p-0">
                <DrawerTitle>
                  <Typography variant="h3" className="font-semibold">
                    Configure campaign
                  </Typography>
                </DrawerTitle>
              </DrawerHeader>
              <Separator className="my-6" />
              <CampaignConfigForm
                userCampaign={userCampaign ?? null}
                step={step}
                onStepChange={setStep}
                onSave={handleSaveConfig}
                isSaving={patchMutation.isPending}
              />
            </DrawerContent>
          </Drawer>
        </section>
      </CardContent>
    </Card>
  );
}
