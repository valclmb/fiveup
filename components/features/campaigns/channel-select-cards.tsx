"use client";

import type { ChannelValue } from "@/lib/campaigns";
import { cn } from "@/lib/utils";
import Image from "next/image";

export type { ChannelValue };

const CHANNEL_CONFIG: Record<
  ChannelValue,
  { label: string; icon: "mail" | "message-square" | "whatsapp" }
> = {
  whatsapp: { label: "WhatsApp", icon: "whatsapp" },
  sms: { label: "SMS", icon: "message-square" },
  email: { label: "Email", icon: "mail" },
};

export function ChannelSelectCards({
  value,
  onChange,
}: {
  value: ChannelValue;
  onChange: (value: ChannelValue) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {(Object.keys(CHANNEL_CONFIG) as ChannelValue[]).map((channel) => {
        const config = CHANNEL_CONFIG[channel];
        const isSelected = value === channel;
        return (
          <button
            key={channel}
            type="button"
            onClick={() => onChange(channel)}
            className={cn(
              "relative flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors",
              "hover:border-primary/50 hover:bg-muted/50",
              isSelected
                ? "border-primary bg-primary/5"
                : "border-border bg-card"
            )}
          >
            <div className="absolute right-2 top-2">
              <div
                className={cn(
                  "flex size-5 items-center justify-center rounded-full border-2 transition-colors",
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/30"
                )}
              >
                {isSelected && (
                  <div className="size-2 rounded-full bg-primary-foreground" />
                )}
              </div>
            </div>
            <ChannelIcon channel={channel} />
            <span className="font-medium">{config.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function ChannelIcon({ channel }: { channel: ChannelValue }) {
  switch (channel) {
    case "email":
      return (
        <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </div>
      );
    case "sms":
      return (
        <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
      );
    case "whatsapp":
      return (
        <div className="flex size-12 items-center justify-center rounded-lg bg-[#25D366]/10">
          <Image
            src="/images/whatsapp-logo.svg"
            alt="WhatsApp"
            width={28}
            height={28}
          />
        </div>
      );
  }
}
