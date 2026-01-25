import { AppSidebar } from "@/components/features/sidebar/app-sidebar";
import { SiteHeader } from "@/components/features/sidebar/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (<SidebarProvider>
    <AppSidebar variant="inset" />
    <SidebarInset>
      <SiteHeader />
      <div className="p-5">
        {children}
      </div>

    </SidebarInset>
  </SidebarProvider>
  );
}
