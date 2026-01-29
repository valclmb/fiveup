
import { DesignSystemFont, FontSelect } from "@/components/custom-ui/font-select";
import { ImageInput } from "@/components/custom-ui/image-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import InputColor from "@/components/ui/input-color";
import { Skeleton } from "@/components/ui/skeleton";
import Typography from "@/components/ui/typography";
import { deleteOne, getAll, patch, post } from "@/lib/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import CornerRoundnessInput from "./corner-roundness-input";
import { CustomizationPreview } from "./customization-preview";

export type CornerRoundness = "none" | "sm" | "md" | "lg" | "rounded";


const formSchema = z.object({
  font: z.string<DesignSystemFont>(),
  cornerRoundness: z.string<CornerRoundness>(),
  buttonCornerRoundness: z.string<CornerRoundness>(),
  borderColor: z.string(),
  buttonBgColor: z.string(),
  buttonTextColor: z.string(),
  starsColor: z.string(),
  bgColor: z.string(),
  textColor: z.string(),
  cardColor: z.string(),
})
export const GLOBAL_STYLES_QUERY_KEY = ["global-styles"] as const;
export const LOGO_QUERY_KEY = ["global-styles", "logo"] as const;
export type CustomizationGlobalFormValues = z.infer<typeof formSchema>;

const CustomizationGlobal = () => {
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);

  const { data: defaultValues } = useQuery({
    queryKey: GLOBAL_STYLES_QUERY_KEY,
    queryFn: () => getAll<CustomizationGlobalFormValues>("global-styles"),
  });

  const { data: logoData, isLoading: isLogoLoading, isError: isLogoError } = useQuery({
    queryKey: LOGO_QUERY_KEY,
    queryFn: () => getAll<{ brandLogoUrl: string | null }>("global-styles/logo"),
  });

  const logoUrl = logoData?.brandLogoUrl ?? null;


  const form = useForm<CustomizationGlobalFormValues>({
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
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: (data: CustomizationGlobalFormValues) =>
      patch<CustomizationGlobalFormValues>("global-styles", data),
    onSuccess: (data) => {
      form.reset(data);
      queryClient.invalidateQueries({ queryKey: GLOBAL_STYLES_QUERY_KEY });
      toast.success("Styles enregistrés");
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    saveMutation.mutate(data);
  });


  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.set("file", file);
      return post("brand/upload-logo", formData, true);
    },
    onSuccess: (data) => {
      setLogoPreviewUrl((prev) => {
        if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
        return data.url;
      });
      queryClient.setQueryData(LOGO_QUERY_KEY, { brandLogoUrl: data.url });
      toast.success("Logo mis à jour");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteOne("brand/logo", ""),
    onSuccess: () => {
      setLogoPreviewUrl((prev) => {
        if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
        return null;
      });
      queryClient.invalidateQueries({ queryKey: LOGO_QUERY_KEY });
      toast.success("Logo supprimé");
    },
  });

  const handleLogoPreviewChange = useCallback((url: string) => {
    setLogoPreviewUrl((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return url || null;
    });
  }, []);


  return (
    <div className="flex gap-4 w-full " >
      <div className="flex flex-col gap-4 items-end" >
        <Card className="min-w-max">
          <CardContent className="space-y-8 ">
            <form id="customization-global-form" onSubmit={handleSubmit}>
              <FieldGroup className="w-full min-w-0 [container-type:normal]" >
                <section className="flex gap-6 items-start">
                  <div className="flex flex-col gap-4">
                    <Typography variant="h4">General</Typography>

                    {isLogoLoading ? <Skeleton className="w-50  flex-1 min-h-24 " /> : (
                      <ImageInput
                        variant="logo"
                        className="flex-1 min-h-0"
                        previewClassName="w-50 h-full min-h-24"
                        defaultPreviewUrl={logoPreviewUrl ?? logoUrl ?? undefined}
                        onPreviewChange={handleLogoPreviewChange}
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
                        <Field
                          className="min-w-48"
                          data-invalid={fieldState.invalid}

                        >
                          <FieldLabel htmlFor="customization-global-form-font">
                            Font
                          </FieldLabel>
                          <FontSelect id="customization-global-form-font" value={field.value} onValueChange={field.onChange} />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name="bgColor"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field
                          className="min-w-48"
                          data-invalid={fieldState.invalid}
                        >
                          <InputColor alpha label="Background Color" {...field} />

                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
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
                          <Field
                            className="min-w-48"
                            data-invalid={fieldState.invalid}

                          >

                            <InputColor alpha label="Card Color" {...field} />
                            <FieldContent className="relative">
                              <FieldDescription className="absolute -bottom-2 right-0 text-xs">Only for desktop view</FieldDescription>

                            </FieldContent>
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                      <Controller
                        name="textColor"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field
                            className="min-w-48"
                            data-invalid={fieldState.invalid}
                          >
                            <InputColor alpha label="Text Color" {...field} />

                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
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
                          <Field
                            className="min-w-48"
                            data-invalid={fieldState.invalid}
                          >
                            <InputColor alpha label="Border Color" {...field} />

                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                      <Controller
                        name="starsColor"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field
                            className="min-w-48"
                            data-invalid={fieldState.invalid}
                          >
                            <InputColor alpha label="Stars Color" {...field} />

                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    </div>
                  </div>
                </section>
                <div>
                  <Typography variant="h4">Buttons</Typography>
                  <div className="flex gap-6 mb-5">
                    <Controller
                      name="buttonBgColor"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field
                          className="min-w-48"
                          data-invalid={fieldState.invalid}
                        >
                          <InputColor alpha label="Background Color" {...field} />

                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name="buttonTextColor"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field
                          className="min-w-48"
                          data-invalid={fieldState.invalid}
                        >
                          <InputColor alpha label="Text Color" {...field} />

                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                  <div className="space-y-2">

                    <Controller
                      name="buttonCornerRoundness"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field
                          className="min-w-48"
                          data-invalid={fieldState.invalid}
                        >
                          <FieldLabel htmlFor="customization-global-form-buttonCornerRoundness">
                            <Typography variant="h4">Button Corner roundness</Typography>
                          </FieldLabel>
                          <CornerRoundnessInput {...field} />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                </div>


              </FieldGroup>
            </form>

          </CardContent>
        </Card>
        {
          form.formState.isDirty && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => form.reset()}>
                Annuler
              </Button>
              <Button type="submit" form="customization-global-form">
                {saveMutation.isPending ? <Loader2 className="animate-spin" /> : "Valider les changements"}
              </Button>
            </div>
          )
        }
      </div >
      <div >
        <CustomizationPreview logoUrl={logoPreviewUrl ?? logoUrl ?? ""} styles={form.watch()} />
      </div>
    </div >
  )
}

export default CustomizationGlobal;