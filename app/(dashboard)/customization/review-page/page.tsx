"use client";

import { CustomizationPageLayout } from "@/components/features/customization/customization-page-layout";
import { PreviewLayout } from "@/components/features/customization/preview-layout";
import { ReviewPageForm, useReviewPageForm } from "@/components/features/customization/review/review-page-form";
import { ReviewPagePreview } from "@/components/features/customization/review/review-page-preview";

export default function ReviewPage() {
  const { form, saveMutation } = useReviewPageForm();

  return (
    <CustomizationPageLayout
      content={<ReviewPageForm form={form} saveMutation={saveMutation} />}
      preview={
        <PreviewLayout
          className="flex h-full w-full flex-col gap-4 rounded-md py-8 px-6"
        >
          {(styles) => <ReviewPagePreview styles={styles} content={form.watch()} />}
        </PreviewLayout>
      }
    />
  );
}
