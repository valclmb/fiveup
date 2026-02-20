"use client";

import { Badge } from "@/components/ui/badge";
import {
  CHANNELS,
  hoursToValueAndUnit,
  TRIGGER_ICONS,
  TRIGGER_TYPES,
  type ChannelValue,
  type TriggerType,
} from "@/lib/campaigns";
import { cn } from "@/lib/utils";
import { Mail, MessageSquare, ShoppingBag } from "lucide-react";
import Image from "next/image";

const UNIT_LABELS: Record<"hours" | "days" | "weeks", { singular: string; plural: string }> = {
  hours: { singular: "hour", plural: "hours" },
  days: { singular: "day", plural: "days" },
  weeks: { singular: "week", plural: "weeks" },
};

function ChannelIcon({ channel, className }: { channel: ChannelValue; className?: string }) {
  switch (channel) {
    case "email":
      return <Mail className={className} />;
    case "sms":
      return <MessageSquare className={className} />;
    case "whatsapp":
      return (
        <Image
          src="/images/whatsapp-logo.svg"
          alt="WhatsApp"
          width={16}
          height={16}
          className={className}
        />
      );
  }
}

export function CampaignSummaryTags({
  delayHours,
  triggerType = "purchase",
  channel,
  className,
}: {
  delayHours: number;
  triggerType?: string;
  channel: string;
  className?: string;
}) {
  const { value, unit } = hoursToValueAndUnit(delayHours);
  const unitLabel = value === 1 ? UNIT_LABELS[unit].singular : UNIT_LABELS[unit].plural;
  const triggerLabel =
    TRIGGER_TYPES.find((t) => t.value === triggerType)?.label ?? "On purchase";
  const channelConfig = CHANNELS.find((c) => c.value === channel);
  const channelLabel = channelConfig?.label ?? channel;
  const channelValue = (channelConfig?.value ?? channel) as ChannelValue;

  const TriggerIcon = TRIGGER_ICONS[triggerType as TriggerType] ?? ShoppingBag;

  const iconWrapperClass = "flex size-8 shrink-0 items-center justify-center [&>svg]:!size-5  [&>img]:!size-5";

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <Badge variant="secondary" className="px-2 " >
        <span className={iconWrapperClass}>
          <TriggerIcon className="text-muted-foreground" />
        </span>
        <span>
          {value} {unitLabel} after {triggerLabel.replace("On ", "").toLowerCase()}
        </span>
      </Badge>
      <Badge variant="secondary" className="px-2" >
        <span className={iconWrapperClass}>
          <ChannelIcon channel={channelValue} className="text-muted-foreground" />
        </span>
        <span>{channelLabel}</span>
      </Badge>
    </div>
  );
}
