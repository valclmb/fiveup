"use client";


import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import Typography from "@/components/ui/typography";
import { valueAndUnitToHours } from "@/lib/campaigns";
import { deleteOne, getAll, patch } from "@/lib/fetch";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  CampaignConfigForm,
  type CampaignConfigFormValues
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
      thanksMessageEnabled: formData.thanksMessageEnabled,
      thanksMessageContent: formData.thanksMessageContent,
    });
    setDrawerOpen(false);
  };

  if (isLoading) return <CampaignSkeleton />;
  if (!hasStore) return <NoStoreCard />;

  return (
    <Card className="relative w-full max-w-sm pt-0 rounded-3xl">
      <div className="relative">
        <img
          src="https://avatar.vercel.sh/shadcn1"
          alt="Event cover"
          className={cn("h-40 w-full object-cover brightness-40 blur-2xl transition-all duration-300", isActive && "brightness-60")}
        />

      </div>
      <CardAction className="absolute top-3 right-3">
        <Badge variant="secondary" className="flex items-center justify-end rounded-full border border-white/10 gap-2 pr-1 pl-2 py-3 bg-background/40 backdrop-blur-3xl">
          <span className="w-14 text-center">{isActive ? "Active" : "Disabled"}</span>
          <Switch
            id="campaign-switch"
            checked={isActive}
            onCheckedChange={handleSwitchChange}
            disabled={patchMutation.isPending || deleteMutation.isPending}
          /></Badge>
      </CardAction>

      <CardHeader className="flex flex-col gap-4">

        <CardTitle className={cn("transition-all duration-300", isActive ? "opacity-100" : "opacity-50 translate-y-12")}>Review after purchases</CardTitle>
        <div className="flex justify-between items-center min-h-7">
          <div
            className={cn(
              "transition-opacity duration-800",
              isActive && userCampaign ? "opacity-100" : "opacity-0"
            )}
          >
            {isActive && userCampaign && (
              <CampaignSummaryTags
                delayHours={userCampaign.delayHours}
                triggerType={userCampaign.triggerType}
                channel={userCampaign.channel}
              />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>

        <CardDescription className={isActive ? "opacity-100" : "opacity-50"}>
          Automatically send a review request after a purchase.
        </CardDescription>
      </CardContent>

      <CardFooter>
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction="right">
          <DrawerTrigger asChild>
            <Button className="w-full" variant="outline" disabled={!isActive}>
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
      </CardFooter>
    </Card>
  );
}
