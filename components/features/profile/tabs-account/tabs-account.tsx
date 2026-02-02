"use client"
import { TabsContent } from "@/components/ui/tabs";
import Typography from "@/components/ui/typography";
import { authClient } from "@/lib/auth-client";
import AccountForm from "./account-form";

const TabsAccount = () => {
  const { data: session, isPending } = authClient.useSession();


  return <TabsContent value="account">
    <Typography variant="h3" className="mb-4">Account information</Typography>
    {/* <Avatar className="size-20">
      <AvatarImage src={session?.user?.image || ""} />
      <AvatarFallback className={cn("text-4xl", isPending && "animate-pulse")}>{session?.user?.name?.charAt(0)}</AvatarFallback>
    </Avatar> */}

    <AccountForm />
  </TabsContent>
}

export default TabsAccount;