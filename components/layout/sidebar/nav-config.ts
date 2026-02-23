import {
  Coins,
  LayoutDashboard,
  Link as LinkIcon,
  Megaphone,
  Paintbrush,
  Split,
  Star,
  User,
  type LucideIcon,
} from "lucide-react";

export const navMain: { title: string; url: string; icon: LucideIcon }[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Reviews", url: "/reviews", icon: Star },
  { title: "Campaigns", url: "/campaigns", icon: Megaphone },
  { title: "Rules", url: "/rules", icon: Split },
  { title: "Customization", url: "/customization", icon: Paintbrush },
  { title: "Connections", url: "/connections", icon: LinkIcon },
];

/** Header-only routes (shown in site header but not in sidebar). */
const headerOnlyRoutes: { title: string; url: string; icon: LucideIcon }[] = [
  { title: "Profile", url: "/profile", icon: User },
  { title: "Buy tokens", url: "/buy-tokens", icon: Coins },
];

/** Find the nav item that matches the current pathname (exact or prefix for sub-routes). Used by header; includes header-only routes like Profile. */
export function getNavItemForPathname(pathname: string): (typeof navMain)[number] | undefined {
  if (pathname === "/" || pathname === "") return navMain[0];
  const fromHeaderOnly = headerOnlyRoutes.find(
    (item) => pathname === item.url || pathname.startsWith(item.url + "/")
  );
  if (fromHeaderOnly) return fromHeaderOnly;
  return navMain.find(
    (item) => pathname === item.url || pathname.startsWith(item.url + "/")
  );
}
