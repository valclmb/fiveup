"use client";

import { CustomizationPageLayout } from "@/components/features/customization/customization-page-layout";
import {
  GlobalStylesForm,
  useGlobalStylesForm,
} from "@/components/features/customization/global/global-styles-form";
import { PreviewLayout } from "@/components/features/customization/preview-layout";

export default function GlobalStylesPage() {
  const state = useGlobalStylesForm();
  const formValues = state.form.watch();

  return (
    <CustomizationPageLayout
      className="items-start"
      content={<GlobalStylesForm {...state} />}
      preview={
        <PreviewLayout
          previewMode="select"
          stylesOverride={formValues}
          logoUrlOverride={state.logoPreviewUrl ?? undefined}
          className="flex h-full w-full flex-col gap-4 rounded-md py-8 px-6"
        />
      }
    />
  );
}
