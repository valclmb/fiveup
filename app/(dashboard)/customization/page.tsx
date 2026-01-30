"use client"
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { tabs } from "./tabs";

const CustomizationPage = () => {
  const pathname = usePathname()
  const router = useRouter()
  useEffect(() => {
    if (pathname === "/customization") {
      router.push(`customization/${tabs[0].value}`)
    }
  }, [pathname])
};

export default CustomizationPage;