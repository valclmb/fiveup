"use client";

import { ConnectionCard } from "@/components/features/connections/connection-card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export function ConnectWix() {
  return (
    <div className="flex w-full items-center gap-2 group">
      <ConnectionCard.Root>
        <ConnectionCard.Logo>
          <Image
            src="/images/wix-logo.svg"
            alt="Wix"
            width={80}
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

export default ConnectWix;
