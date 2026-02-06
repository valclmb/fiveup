"use client";

import { CustomizationPageLayout } from "@/components/features/customization/customization-page-layout";
import {
  RedirectionPageForm,
  useRedirectionPageForm,
} from "@/components/features/customization/redirection/redirection-page-form";
import { PreviewLayout } from "@/components/features/customization/preview-layout";
import { RedirectionPagePreview } from "@/components/features/customization/redirection/redirection-page-preview";

export default function RedirectionPage() {
  const { form, saveMutation } = useRedirectionPageForm();

  return (
    <CustomizationPageLayout
      content={
        <RedirectionPageForm form={form} saveMutation={saveMutation} />
      }
      preview={
        <PreviewLayout
          previewMode="fixed"
          previewLabel="Page redirection"
          className="flex h-full w-full flex-col gap-4 rounded-md py-8 px-6"
        >
          {(styles) => (
            <RedirectionPagePreview styles={styles} content={form.watch()} />
          )}
        </PreviewLayout>
      }
    />
  );
}
