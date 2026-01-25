"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import { LayoutDashboard, Link, Megaphone, PanelsTopLeft, Star } from "lucide-react"
import Image from "next/image"
import * as React from "react"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Reviews",
      url: "/reviews",
      icon: Star,
    },
    {
      title: "Campaigns",
      url: "#",
      icon: Megaphone,
    },
    {
      title: "Collect Page",
      url: "#",
      icon: PanelsTopLeft,
    },
    {
      title: "Connections",
      url: "#",
      icon: Link,
    },
  ],

}

export const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {

  const { data: session, isPending } = authClient.useSession()
  const user = session?.user

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!px-2 mt-6 mb-4"
            > */}
            <a href="#" >
              <Image
                src="/logo-white-baseline.svg"
                alt="logo"
                width={180}
                height={100}
                className="my-6 pl-2"
              />
            </a>
            {/* </SidebarMenuButton> */}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} isPending={isPending} />
      </SidebarFooter>
    </Sidebar>
  )
}
