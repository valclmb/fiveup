"use client"

import { FeedbackDialog } from "@/components/features/feedback/feedback-dialog";
import { getNavItemForPathname } from "@/components/layout/sidebar/nav-config";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { ModeToggle } from "../features/theme/mode-toggle";

export const SiteHeader = () => {
  const pathname = usePathname();
  const navItem = getNavItemForPathname(pathname);
  const title = navItem?.title ?? "Dashboard";
  const Icon = navItem?.icon;

  return (
    <header className="sticky top-0 z-10 flex bg-background rounded-tl-2xl p-2 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1  lg:gap-2 lg:px-6">
        <SidebarTrigger>
          <MenuIcon className="size-4" />
        </SidebarTrigger>
        <Separator
          orientation="vertical"
          className="mx-2 "
        />
        {Icon && <Icon className="size-5 shrink-0" strokeWidth={2} />}
        <h1 className="text-base font-medium">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <FeedbackDialog />
        <ModeToggle />
      </div>
    </header>
  )
}

