"use client";

import { DesignSystemFont, FontSelect } from "@/components/custom-ui/font-select";
import { ImageInput } from "@/components/custom-ui/image-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import InputColor from "@/components/ui/input-color";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Typography from "@/components/ui/typography";
import type { CornerRoundness } from "@/lib/corner-roundness";
import { deleteOne, getAll, patch, post } from "@/lib/fetch";
import { GLOBAL_STYLES_LOGO_QUERY_KEY, GLOBAL_STYLES_QUERY_KEY } from "@/lib/global-styles-queries";
import { hexColorSchema } from "@/lib/hex-color-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Monitor } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import CornerRoundnessInput from "./corner-roundness-input";
import { ThemePresets, type ThemePresetId } from "./theme-presets";

const formSchema = z.object({
  font: z.string<DesignSystemFont>(),
  cornerRoundness: z.string<CornerRoundness>(),
  buttonCornerRoundness: z.string<CornerRoundness>(),
  borderColor: hexColorSchema,
  buttonBgColor: hexColorSchema,
  buttonTextColor: hexColorSchema,
  starsColor: hexColorSchema,
  bgColor: hexColorSchema,
  textColor: hexColorSchema,
  cardColor: hexColorSchema,
});

export type GlobalStylesFormValues = z.infer<typeof formSchema>;

/** Minimal type so the form accepts either raw useMutation or useProGateSave wrapper. */
export type GlobalStylesSaveMutation = {
  mutate: (data: GlobalStylesFormValues, options?: { onSuccess?: () => void }) => void;
  isPending: boolean;
};

export type GlobalStylesFormProps = Omit<ReturnType<typeof useGlobalStylesForm>, "saveMutation"> & {
  saveMutation: GlobalStylesSaveMutation;
};

/**
 * Formulaire Global Styles (champs + actions). À utiliser dans CustomizationPageLayout avec useGlobalStylesForm().
 */
export function GlobalStylesForm({
  form,
  saveMutation,
  uploadMutation,
  deleteMutation,
  logoUrl,
  logoPreviewUrl,
  onLogoPreviewChange,
  isLogoLoading,
}: GlobalStylesFormProps) {
  const [selectedPresetId, setSelectedPresetId] = useState<ThemePresetId | "">("");
  const handleSubmit = form.handleSubmit((data) =>
    saveMutation.mutate(data, {
      onSuccess: () => setSelectedPresetId(""),
    })
  );

  return (
    <>
      <Card className="min-w-max">
        <CardContent className="space-y-8 ">
          <form id="customization-global-form" onSubmit={handleSubmit}>
            <FieldGroup className="w-full min-w-0 [container-type:normal]">
              <section className="flex gap-6 items-start">
                <div className="flex flex-col gap-4">
                  <Typography variant="h4">General</Typography>
                  {isLogoLoading ? (
                    <Skeleton className="w-50 flex-1 min-h-24" />
                  ) : (
                    <ImageInput
                      variant="logo"
                      className="flex-1 min-h-0"
                      previewClassName="w-50 h-full min-h-24"
                      defaultPreviewUrl={logoPreviewUrl ?? logoUrl ?? undefined}
                      onPreviewChange={onLogoPreviewChange}
                      onFileSelect={(file) => uploadMutation.mutate(file)}
                      onClear={() => deleteMutation.mutate()}
                      clearLoading={deleteMutation.isPending}
                    />
                  )}
                </div>
                <div>
                  <Controller
                    name="font"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="customization-global-form-font">Font</FieldLabel>
                        <FontSelect id="customization-global-form-font" value={field.value} onValueChange={field.onChange} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    name="bgColor"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <InputColor alpha label="Background Color" {...field} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>
              </section>

              <section>
                <div>
                  <Typography variant="h4">Card</Typography>
                  <div className="flex gap-6">
                    <Controller
                      name="cardColor"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field className="min-w-48" data-invalid={fieldState.invalid}>
                          <InputColor alpha label={<FieldLabel className="mb-2">Card Color <OnlyDesktop /></FieldLabel>} {...field} />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                    <Controller
                      name="textColor"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field className="min-w-48" data-invalid={fieldState.invalid}>
                          <InputColor alpha label="Text Color" {...field} />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex gap-6">
                    <Controller
                      name="borderColor"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field className="min-w-48" data-invalid={fieldState.invalid}>
                          <InputColor alpha label="Border Color" {...field} />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                    <Controller
                      name="starsColor"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field className="min-w-48" data-invalid={fieldState.invalid}>
                          <InputColor alpha label="Stars Color" {...field} />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </div>
                  <Controller
                    name="cornerRoundness"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field className="min-w-48 mt-5" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="customization-global-form-cornerRoundness">Card Corner roundness <OnlyDesktop /></FieldLabel>
                        <CornerRoundnessInput {...field} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>
              </section>

              <div>
                <Typography variant="h4">Buttons</Typography>
                <div className="flex gap-6 mb-5">
                  <Controller
                    name="buttonBgColor"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field className="min-w-48" data-invalid={fieldState.invalid}>
                        <InputColor alpha label="Background Color" {...field} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    name="buttonTextColor"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field className="min-w-48" data-invalid={fieldState.invalid}>
                        <InputColor alpha label="Text Color" {...field} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Controller
                    name="buttonCornerRoundness"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field className="min-w-48" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="customization-global-form-buttonCornerRoundness">Button corner roundness</FieldLabel>
                        <CornerRoundnessInput {...field} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <div className="flex w-full justify-between gap-2">
        <ThemePresets
          value={selectedPresetId}
          onPresetSelect={(values, presetId) => {
            form.reset(values, { keepDefaultValues: true });
            setSelectedPresetId(presetId);
          }}
        />
        {form.formState.isDirty && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                form.reset();
                setSelectedPresetId("");
              }}
            >
              Cancel
            </Button>
            <Button type="submit" form="customization-global-form">
              {saveMutation.isPending ? <Loader2 className="animate-spin" /> : "Save changes"}
            </Button>
          </div>
        )}
      </div>

    </>
  );
}

/**
 * Hook : données + form + mutations pour la page Global Styles.
 * À utiliser dans la page avec CustomizationPageLayout + GlobalStylesForm + PreviewLayout + FeedbackPageLayout.
 */
export function useGlobalStylesForm() {
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: defaultValues } = useQuery({
    queryKey: GLOBAL_STYLES_QUERY_KEY,
    queryFn: () => getAll<GlobalStylesFormValues>("customization/global-styles"),
  });

  const { data: logoData, isLoading: isLogoLoading } = useQuery({
    queryKey: GLOBAL_STYLES_LOGO_QUERY_KEY,
    queryFn: () => getAll<{ brandLogoUrl: string | null }>("customization/global-styles/logo"),
  });

  const logoUrl = logoData?.brandLogoUrl ?? null;

  const form = useForm<GlobalStylesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ?? {
      font: "inter",
      cornerRoundness: "md",
      buttonCornerRoundness: "md",
      borderColor: "#000000",
      buttonBgColor: "#000000",
      buttonTextColor: "#FFFFFF",
      starsColor: "#FFD230",
      bgColor: "#FFFFFF",
      textColor: "#000000",
      cardColor: "#FFFFFF",
    },
  });

  useEffect(() => {
    if (defaultValues) form.reset(defaultValues);
  }, [defaultValues, form]);

  const saveMutation = useMutation({
    mutationFn: (data: GlobalStylesFormValues) => patch<GlobalStylesFormValues>("customization/global-styles", data),
    onSuccess: (data) => {
      form.reset(data);
      queryClient.invalidateQueries({ queryKey: GLOBAL_STYLES_QUERY_KEY });
      toast.success("Styles saved successfully");
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.set("file", file);
      return post("customization/global-styles/logo", formData, true);
    },
    onSuccess: (data) => {
      setLogoPreviewUrl((prev) => {
        if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
        return data.url;
      });
      queryClient.setQueryData(GLOBAL_STYLES_LOGO_QUERY_KEY, { brandLogoUrl: data.url });
      toast.success("Logo updated successfully");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteOne("customization/global-styles/logo", ""),
    onSuccess: () => {
      setLogoPreviewUrl((prev) => {
        if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
        return null;
      });
      queryClient.invalidateQueries({ queryKey: GLOBAL_STYLES_LOGO_QUERY_KEY });
      toast.success("Logo deleted successfully");
    },
  });

  const onLogoPreviewChange = useCallback((url: string) => {
    setLogoPreviewUrl((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return url || null;
    });
  }, []);

  return {
    form,
    saveMutation,
    uploadMutation,
    deleteMutation,
    logoUrl,
    logoPreviewUrl,
    onLogoPreviewChange,
    isLogoLoading,
  };
}

function OnlyDesktop() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Monitor className="size-4 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent>Only visible on desktop view</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
