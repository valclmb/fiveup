"use client";

import { ReviewsList } from "./reviews-list";

/** @deprecated Use ReviewsList directly - shows unified reviews with optional platform filter */
export function TrustpilotReviewsList() {
  return <ReviewsList hasTrustpilot={true} hasGoogle={false} />;
}

export default TrustpilotReviewsList;
