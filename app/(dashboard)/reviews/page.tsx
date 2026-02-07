"use client";

import {
  ReviewsList,
  type ReviewSource,
} from "@/components/features/reviews/reviews-list";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { getAll } from "@/lib/fetch";
import { useState } from "react";
import Image from "next/image";

export default function ReviewsPage() {
  const [source, setSource] = useState<ReviewSource>("trustpilot");

  const { data: trustpilotAccount } = useQuery({
    queryKey: ["trustpilot-account"],
    queryFn: () => getAll<{ connected: boolean }>("reviews/trustpilot/account"),
  });

  const { data: googleAccount } = useQuery({
    queryKey: ["google-reviews-account"],
    queryFn: () => getAll<{ connected: boolean }>("reviews/google/account"),
  });

  const hasTrustpilot = trustpilotAccount?.connected ?? false;
  const hasGoogle = googleAccount?.connected ?? false;

  const effectiveSource: ReviewSource =
    hasTrustpilot && hasGoogle
      ? source
      : hasGoogle
        ? "google"
        : "trustpilot";

  return (
    <div className="space-y-6">
      {hasTrustpilot && hasGoogle && (
        <Tabs
          value={source}
          onValueChange={(v) => setSource(v as ReviewSource)}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="trustpilot" className="gap-2">
              <Image
                src="/images/trustpilot-logo.svg"
                alt="Trustpilot"
                width={20}
                height={14}
                className="hidden object-contain dark:block"
              />
              <Image
                src="/images/trustpilot-logo-dark.svg"
                alt="Trustpilot"
                width={20}
                height={14}
                className="object-contain dark:hidden"
              />
              Trustpilot
            </TabsTrigger>
            <TabsTrigger value="google" className="gap-2">
              <Image
                src="/images/google-logo.svg"
                alt="Google Maps"
                width={20}
                height={14}
                className="object-contain"
              />
              Google Maps
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      <ReviewsList source={effectiveSource} />
    </div>
  );
}
