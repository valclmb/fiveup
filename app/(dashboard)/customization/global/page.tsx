"use client";

import { CustomizationPageLayout } from "@/components/features/customization/customization-page-layout";
import {
  GlobalStylesForm,
  useGlobalStylesForm,
} from "@/components/features/customization/global/global-styles-form";
import { PreviewLayout } from "@/components/features/customization/preview-layout";
import {
  UpgradeProDialog,
  useProGateSave,
} from "@/components/features/customization/upgrade-pro-dialog";

export default function GlobalStylesPage() {
  const state = useGlobalStylesForm();
  const gate = useProGateSave(state.saveMutation);
  const formValues = state.form.watch();

  return (
    <>
      <CustomizationPageLayout
        className="items-start"
        content={
          <GlobalStylesForm
            {...state}
            saveMutation={{ mutate: gate.mutate, isPending: gate.isPending }}
          />
        }
      preview={
        <PreviewLayout
          previewMode="select"
          stylesOverride={formValues}
          logoUrlOverride={state.logoPreviewUrl ?? undefined}
          className="flex h-full w-full flex-col gap-4 rounded-md py-8 px-6"
        />
      }
    />
      <UpgradeProDialog
        open={gate.upgradeDialogOpen}
        onOpenChange={gate.setUpgradeDialogOpen}
      />
    </>
  );
}
