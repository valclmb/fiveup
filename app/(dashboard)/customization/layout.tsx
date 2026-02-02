"use client"
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { tabs } from "./tabs";



const CustomizationLayout = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const page = pathname.split("/").pop()

  useEffect(() => {
    if (pathname === "/customization") {
      router.push(`customization/${tabs[0].value}`)
    }
  }, [pathname])


  return (
    <div className="flex gap-4">
      <Tabs orientation="vertical" className="w-full" value={page || tabs[0].value}>
        <TabsList className="gap-2 h-max" >
          {tabs.map((tab) => (
            <TabsTab key={tab.value} value={tab.value} className="h-10 px-0" >
              <Link href={`${tab.value}`} className="flex w-full h-full items-center gap-2 px-2">
                <tab.icon className="size-5" color={tab.value === page ? "var(--primary)" : "var(--muted-foreground)"} />{tab.label}
              </Link>
            </TabsTab>
          ))}

        </TabsList>

        {children}


      </Tabs>

    </div>
  );
};

export default CustomizationLayout;