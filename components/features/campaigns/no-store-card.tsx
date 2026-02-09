"use client";

import { Card, CardContent } from "@/components/ui/card";
import Typography from "@/components/ui/typography";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export function NoStoreCard() {
  return (
    <Card className="max-w-2xl p-0">
      <CardContent className="space-y-2 p-10">
        <Typography variant="p" affects="muted" className="text-lg flex items-center gap-2">
          <ShoppingBag /> Connect your Shopify store first to configure campaigns.
        </Typography>
        <Typography variant="p" affects="muted">
          You can connect your store in the <Link href="/connections" className="text-primary hover:underline">connections</Link> page.
        </Typography>
      </CardContent>
    </Card>
  );
}
