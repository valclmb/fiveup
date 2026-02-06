import { TrustpilotReviewsList } from "@/components/features/reviews/trustpilot-reviews-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Typography from "@/components/ui/typography";

export default function ReviewsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Typography variant="h2">Trustpilot Reviews</Typography>
        </CardTitle>
        <Typography variant="description">
          View and manage your Trustpilot reviews imported from your connected account.
        </Typography>
      </CardHeader>
      <CardContent>
        <TrustpilotReviewsList />
      </CardContent>
    </Card>
  );
}
