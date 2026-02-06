import { ReviewDetail } from "@/components/features/reviews/review-detail";

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <ReviewDetail id={id} />
    </div>
  );
}
