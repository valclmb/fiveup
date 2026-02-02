"use client";

import { ConnectionCard } from "@/components/features/connections/connection-card";
import { Badge } from "@/components/ui/badge";
import { ShineBorder } from "@/components/ui/shine-border";
import Image from "next/image";

export function ConnectWhatsapp() {
  return (
    <div className="flex w-full items-center gap-2 group">
      <ConnectionCard.Root>
        <ShineBorder borderWidth={1} shineColor={["var(--primary)", "yellow", "cyan"]} />
        <ConnectionCard.Logo>
          <Image
            src="/images/whatsapp-logo.svg"
            alt="Whatsapp"
            width={40}
            height={24}
            className="object-contain"
          />
        </ConnectionCard.Logo>
        <ConnectionCard.Actions>
          <Badge variant="secondary" className="font-normal">
            Coming Soon
          </Badge>
        </ConnectionCard.Actions>
      </ConnectionCard.Root>
    </div>
  );
}

export default ConnectWhatsapp;
