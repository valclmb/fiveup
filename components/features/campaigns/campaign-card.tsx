"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import Typography from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface CampaignCardProps {
  /** Index for avatar.vercel.sh/shadcn (1, 2, 3, etc.). Default 1. */
  imageIndex?: number;
  /** Image URL for the card cover. Overrides imageIndex when provided. */
  imageSrc?: string;
  /** Alt text for the image */
  imageAlt?: string;
  /** Card title */
  title: string;
  /** Card description */
  description: string;
  /** Whether the campaign is active */
  isActive: boolean;
  /** Called when the switch is toggled */
  onSwitchChange: (checked: boolean) => void;
  /** Disable the switch (e.g. while saving) */
  isSwitchDisabled?: boolean;
  /** Optional summary tags shown when active */
  summaryTags?: React.ReactNode;
  /** Drawer title */
  drawerTitle: string;
  /** Custom drawer content. Receives closeDrawer to close when done (e.g. after save). */
  drawerContent:
  | React.ReactNode
  | ((props: { closeDrawer: () => void }) => React.ReactNode);
  /** Configure button label */
  configureButtonLabel?: string;
  /** Allow opening the drawer when campaign is disabled (e.g. for placeholder/coming soon) */
  allowConfigureWhenDisabled?: boolean;
}

export function CampaignCard({
  imageIndex = 1,
  imageSrc,
  imageAlt = "Campaign cover",
  title,
  description,
  isActive,
  onSwitchChange,
  isSwitchDisabled = false,
  summaryTags,
  drawerTitle,
  drawerContent,
  configureButtonLabel = "Configure campaign",
  allowConfigureWhenDisabled = false,
}: CampaignCardProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const src = imageSrc ?? `https://avatar.vercel.sh/shadcn${imageIndex}`;

  return (
    <Card className="relative w-full max-w-sm pt-0  rounded-3xl">
      <div className="relative">
        <img
          src={src}
          alt={imageAlt}
          className={cn(
            "h-40 w-full object-cover brightness-40 blur-2xl transition-all duration-300",
            isActive && "brightness-60"
          )}
        />
      </div>
      <CardAction className="absolute top-3 right-3">
        <Badge
          variant="secondary"
          className="flex items-center justify-end rounded-full border border-white/10 gap-2 pr-1 pl-2 py-3 bg-background/40 backdrop-blur-3xl"
        >
          <span className={cn("w-14 text-center transition-all duration-300", isActive ? "opacity-100" : "opacity-50")}>
            {isActive ? "Active" : "Disabled"}
          </span>
          <Switch
            id="campaign-switch"
            checked={isActive}
            onCheckedChange={onSwitchChange}
            disabled={isSwitchDisabled}
          />
        </Badge>
      </CardAction>

      <CardHeader className="flex flex-col gap-4">
        <CardTitle
          className={cn(
            "transition-all duration-300",
            (isActive && summaryTags) ? "translate-y-0 " : "translate-y-12",
            isActive ? "opacity-100" : "opacity-50"
          )}
        >
          {title}
        </CardTitle>
        <div className="flex justify-between items-center min-h-7">
          <div
            className={cn(
              "transition-opacity duration-800",
              isActive && summaryTags ? "opacity-100" : "opacity-0"
            )}
          >
            {isActive && summaryTags}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className={isActive ? "opacity-100" : "opacity-50"}>
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction="right">
          <DrawerTrigger asChild>
            <Button
              className="w-full"
              variant="outline"
              disabled={!isActive && !allowConfigureWhenDisabled}
            >
              {configureButtonLabel}
            </Button>
          </DrawerTrigger>
          <DrawerContent className="min-w-xl p-8">
            <DrawerHeader className="p-0">
              <DrawerTitle>
                <Typography variant="h3" className="font-semibold">
                  {drawerTitle}
                </Typography>
              </DrawerTitle>
            </DrawerHeader>
            <Separator className="my-6" />
            {typeof drawerContent === "function"
              ? drawerContent({ closeDrawer: () => setDrawerOpen(false) })
              : drawerContent}
          </DrawerContent>
        </Drawer>
      </CardFooter>
    </Card>
  );
}
