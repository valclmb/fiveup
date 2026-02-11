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
import { useTheme } from "next-themes"
import Image from "next/image"
import * as React from "react"
import { navMain } from "./nav-config"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { SidebarTokensCta } from "./sidebar-tokens-cta"
import { UpgradeCta } from "./upgrade-cta"

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
        <NavMain items={navMain} />
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
