"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { Coins, ShoppingCart } from "lucide-react";
import Link from "next/link";

export function SidebarTokensCta() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const tokenBalance = (user as { tokenBalance?: number })?.tokenBalance ?? "...";

  return (
    <SidebarGroup className="p-0">
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem className="flex flex-col items-center justify-between gap-2 p-2">
            <div className="flex items-center gap-1.5">
              <Coins className="size-5 text-primary" />
              {tokenBalance} tokens
            </div>
            <SidebarMenuButton asChild>
              <Link
                href="/buy-tokens"
                className={buttonVariants({
                  variant: "outline",
                  size: "sm"
                })}
              >
                <ShoppingCart />
                Buy tokens
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
