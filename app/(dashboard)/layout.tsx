import { auth } from "@/auth";
import { AppSidebar } from "@/components/features/sidebar/app-sidebar";
import { SiteHeader } from "@/components/features/sidebar/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/auth/signin");
  }

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
