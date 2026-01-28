"use client"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        <TabsList className="gap-2" >
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} asChild>
              <Link href={`${tab.value}`}>
                <tab.icon />{tab.label}
              </Link>
            </TabsTrigger>
          ))}

        </TabsList>

        {children}


      </Tabs>

    </div>
  );
};

export default CustomizationLayout;