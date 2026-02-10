"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import { LayoutDashboard, Link as LinkIcon, Megaphone, Paintbrush, Split, Star } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"
import * as React from "react"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { SidebarTokensCta } from "./sidebar-tokens-cta"
import { UpgradeCta } from "./upgrade-cta"

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
      url: "/campaigns",
      icon: Megaphone,
    },
    {
      title: "Rules",
      url: "/rules",
      icon: Split
    },
    {
      title: "Customization",
      url: "/customization",
      icon: Paintbrush,
    },
    {
      title: "Connections",
      url: "/connections",
      icon: LinkIcon,
    },
  ],

}

export const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user
  const plan = user?.plan ?? "free"
  const isFreePlan = !isPending && plan === "free"

  const { resolvedTheme } = useTheme()
  const logoSrc = mounted && resolvedTheme === "dark"
    ? "/logos/logo-white.svg"
    : "/logos/logo-black.svg"
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <a href="#" >
              <Image
                src={logoSrc}
                alt="logo"
                width={100}
                height={100}
                className="my-6 pl-2 "
              />
            </a>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarTokensCta />
        <SidebarSeparator className="mx-0" />
        {isFreePlan && <UpgradeCta />}
        <NavUser user={user} isPending={isPending} />
      </SidebarFooter>
    </Sidebar>
  )
}
