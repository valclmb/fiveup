"use client";

import { ConnectionCard } from "@/components/features/connections/connection-card";
import { Badge } from "@/components/ui/badge";
import { Mail } from "lucide-react";

export function ConnectMail() {
  return (
    <div className="flex w-full items-center gap-2 group">
      <ConnectionCard.Root>
        <ConnectionCard.Logo>
          <Mail className="size-9" strokeWidth={1.5} />
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

export default ConnectMail;
