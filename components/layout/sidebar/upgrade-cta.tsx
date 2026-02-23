import { buttonVariants } from "@/components/ui/button";
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { ChevronsUp } from "lucide-react";
import Link from "next/link";


export function UpgradeCta() {
  return (
    <SidebarGroup className="px-0">
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center p-0 gap-2">
            <SidebarMenuButton asChild>
              <Link
                href="/pricing"
                className={buttonVariants({
                  variant: "default",
                  class:
                    "relative overflow-hidden border-primary hover:!bg-primary/90 hover:!text-primary-foreground hover:!border-transparent",
                })}
              >
                <ChevronsUp />
                <span className="relative z-20">Upgrade your plan</span>
                {/* Shimmer: gradient bar that sweeps across */}
                <div
                  className="absolute inset-0 z-10 w-1/2 animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  aria-hidden
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
