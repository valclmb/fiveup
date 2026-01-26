import ConnectGoogleBusiness from "@/components/features/connections/connect-google-business";
import ShopifyIntegrationCard from "@/components/features/connections/connect-shopify";
import { Card, CardContent } from "@/components/ui/card";
import Typography from "@/components/ui/typography";


export default function Page() {
  return (
    <Card className="bg-background">
      <CardContent>
        <Typography variant="p">Votre boutique</Typography>
        <Typography variant="description" className="text-muted-foreground">Connectez-vous à votre compte Google business, Trustpilot, avis vérifiés et Shopify</Typography>
        <ShopifyIntegrationCard />
        <ConnectGoogleBusiness />
      </CardContent>
    </Card>
  )
}
