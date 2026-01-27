import { buttonVariants } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import Typography from "@/components/ui/typography";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

const TabsBilling = () => {
  return <TabsContent value="billing">
    <Typography variant="h3" className="mb-4">Billing</Typography>
    <Link href="/api/stripe/create-portal-session" target="_blank" className={buttonVariants()}>
      Manage in Stripe <ExternalLink />
    </Link>
  </TabsContent>
}

export default TabsBilling;