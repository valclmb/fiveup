"use client";

import { CustomizationPageLayout } from "@/components/features/customization/customization-page-layout";
import {
  FeedbackPageForm,
  useFeedbackPageForm,
} from "@/components/features/customization/feedback/feedback-page-form";
import { FeedbackPageLayout } from "@/components/features/customization/feedback/feedback-page-layout";
import { PreviewLayout } from "@/components/features/customization/preview-layout";
import {
  UpgradeProDialog,
  useProGateSave,
} from "@/components/features/customization/upgrade-pro-dialog";

export default function FeedbackPage() {
  const { form, saveMutation } = useFeedbackPageForm();
  const gate = useProGateSave(saveMutation);
  const formValues = form.watch();

  return (
    <>
      <CustomizationPageLayout
        content={
          <FeedbackPageForm
            form={form}
            saveMutation={{ mutate: gate.mutate, isPending: gate.isPending }}
          />
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
      <UpgradeProDialog
        open={gate.upgradeDialogOpen}
        onOpenChange={gate.setUpgradeDialogOpen}
      />
    </>
  );
}
