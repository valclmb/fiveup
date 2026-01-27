"use client";
import TabsAccount from "@/components/features/profile/tabs-account/tabs-account";
import TabsBilling from "@/components/features/profile/tabs-billing";
import TabsNotification from "@/components/features/profile/tabs-notification";
import TabsSecurity from "@/components/features/profile/tabs-security";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsCredentialUser } from "@/hooks/use-auth-accounts";
import { Bell, CreditCard, Lock, User } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
function ProfilePage() {
  const [tabValue, setTabValue] = useState("account")
  const { isCredentialUser } = useIsCredentialUser();


  const searchParams = useSearchParams()
  const tab = searchParams.get('tab')


  useEffect(() => {
    setTabValue(tab || "account")
  }, [tab])




  return <div className="flex gap-4 ">
    <Tabs defaultValue={tabValue} value={tabValue} onValueChange={setTabValue} orientation="vertical" className=" min-w-[500px]">
      <TabsList className="gap-2" >
        <TabsTrigger value="account">
          <User />Account information </TabsTrigger>
        <TabsTrigger value="billing" >
          <CreditCard />
          Billing
        </TabsTrigger>
        <TabsTrigger value="notification">
          <Bell />
          Notification</TabsTrigger>
        {isCredentialUser && <TabsTrigger value="security">
          <Lock />
          Security</TabsTrigger>}
      </TabsList>
      <Card className="bg-background min-w-full">

        <CardContent>
          <TabsAccount />
          <TabsNotification />
          {isCredentialUser && <TabsSecurity />}
          <TabsBilling />
        </CardContent>
      </Card>
    </Tabs>

  </div>
}

export default ProfilePage;