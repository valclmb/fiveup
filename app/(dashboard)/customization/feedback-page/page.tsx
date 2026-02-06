"use client";

import { CustomizationPageLayout } from "@/components/features/customization/customization-page-layout";
import {
  FeedbackPageForm,
  useFeedbackPageForm,
} from "@/components/features/customization/feedback/feedback-page-form";
import { FeedbackPageLayout } from "@/components/features/customization/feedback/feedback-page-layout";
import { PreviewLayout } from "@/components/features/customization/preview-layout";

export default function FeedbackPage() {
  const { form, saveMutation } = useFeedbackPageForm();
  const formValues = form.watch();

  return (
    <CustomizationPageLayout
      content={
        <FeedbackPageForm form={form} saveMutation={saveMutation} />
      }
      preview={
        <PreviewLayout
          previewMode="fixed"
          previewLabel="Formulaire feedback"
          className="flex h-full w-full flex-col gap-4 rounded-md py-8 px-6"
        >
          {(styles) => (
            <FeedbackPageLayout styles={styles} content={formValues} />
          )}
        </PreviewLayout>
      }
    />
  );
}
