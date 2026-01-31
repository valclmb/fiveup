"use client";

import { CustomizationPageLayout } from "@/components/features/customization/customization-page-layout";
import {
  FeedbackPageForm,
  useFeedbackPageForm,
} from "@/components/features/customization/feedback/feedback-page-form";
import { PreviewLayout } from "@/components/features/customization/preview-layout";
import { FeedbackForm } from "@/components/features/feedback/feedback-form";

export default function FeedbackPage() {
  const { form, saveMutation } = useFeedbackPageForm();

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
            <FeedbackForm styles={styles} content={form.watch()} />
          )}
        </PreviewLayout>
      }
    />
  );
}
