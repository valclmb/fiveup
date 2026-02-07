"use client";

import { ReviewsList } from "./reviews-list";

/** @deprecated Use ReviewsList with source="trustpilot" instead */
export function TrustpilotReviewsList() {
  return <ReviewsList source="trustpilot" />;
}

export default TrustpilotReviewsList;
