import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getAll, patch } from "@/lib/fetch";
import { REVIEW_PAGE_QUERY_KEY } from "@/lib/review-page-queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { SelectRatingTemplate } from "./select-rating/select-rating-template";


const formSchema = z.object({
  title: z.string(),
  ratingTemplate: z.enum(["arc-stars", "classic"]),
  buttonText: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

const DEFAULT_VALUES: FormSchema = {
  title: "Comment noteriez vous votre expérience ?",
  ratingTemplate: "classic",
  buttonText: "Continuer",
};

export function ReviewPageForm({
  form,
  saveMutation,
}: {
  form: UseFormReturn<FormSchema>;
  saveMutation: { mutate: (data: FormSchema) => void; isPending: boolean };
}) {
  const handleSubmit = form.handleSubmit((data) => saveMutation.mutate(data));

  return (
    <>
      <Card className="min-w-96">
        <CardContent>
          <form id="review-page-form" onSubmit={handleSubmit}>
            <FieldGroup className="w-full min-w-0 [container-type:normal]">

              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="min-w-48" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="review-page-form-title">Titre</FieldLabel>
                    <Input id="review-page-form-title" {...field} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />


              <Controller
                name="ratingTemplate"
                control={form.control}
                render={({ field }) => (
                  <SelectRatingTemplate
                    value={field.value}
                    onChange={field.onChange}
                    label="Type de notation"
                  />
                )}
              />

              {form.watch("ratingTemplate") != "arc-stars" && (
                <Controller
                  name="buttonText"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field className="min-w-48" data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="review-page-form-buttonText">Texte du bouton</FieldLabel>
                      <Input id="review-page-form-buttonText" {...field} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              )}
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      {form.formState.isDirty && (
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => form.reset()}>
            Annuler
          </Button>
          <Button type="submit" form="review-page-form" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? "Enregistrement…" : "Valider les changements"}
          </Button>
        </div>
      )}
    </>
  );
}

export const useReviewPageForm = () => {
  const queryClient = useQueryClient();

  const { data: defaultValues } = useQuery({
    queryKey: REVIEW_PAGE_QUERY_KEY,
    queryFn: () => getAll<FormSchema>("customization/review-page"),
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ?? DEFAULT_VALUES,
  });

  useEffect(() => {
    if (defaultValues) form.reset(defaultValues);
  }, [defaultValues, form]);

  const saveMutation = useMutation({
    mutationFn: (data: FormSchema) =>
      patch<FormSchema>("customization/review-page", data),
    onSuccess: (data) => {
      form.reset(data);
      queryClient.invalidateQueries({ queryKey: REVIEW_PAGE_QUERY_KEY });
      toast.success("Page review enregistrée");
    },
  });

  return { form, saveMutation };
};