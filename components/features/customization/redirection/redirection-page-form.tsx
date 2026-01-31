import type { TogglableForm } from "@/components/features/customization/togglable-field";
import { TogglableField } from "@/components/features/customization/togglable-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Item, ItemContent, ItemDescription, ItemMedia } from "@/components/ui/item";
import { getAll, patch } from "@/lib/fetch";
import { REDIRECTION_PAGE_QUERY_KEY } from "@/lib/redirection-page-queries";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronsUp, Info } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Controller, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const descriptionSchema = z.object({
  enabled: z.boolean(),
  content: z.string(),
});

const formSchema = z.object({
  title: z.string(),
  buttonText: z.string(),
  description: descriptionSchema,
});

type FormSchema = z.infer<typeof formSchema>;

const DEFAULT_VALUES: FormSchema = {
  title: "Thank you for your feedback!",
  buttonText: "Continue",
  description: { enabled: true, content: "You will be redirected to review platforms to share your experience." },
};

export function RedirectionPageForm({
  form,
  saveMutation,
}: {
  form: UseFormReturn<FormSchema>;
  saveMutation: { mutate: (data: FormSchema) => void; isPending: boolean };
}) {
  const [showInfo, setShowInfo] = useState(true);
  const handleSubmit = form.handleSubmit((data) => saveMutation.mutate(data));

  return (
    <div className="max-w-[500px]">
      <Item className="pb-10" variant="outline" >
        <ItemMedia variant="icon" >
          <Info />
        </ItemMedia >
        <ItemContent>
          <ItemDescription className="line-clamp-none">
            This page acts as a transition between the review the user has left and the review platforms (Trustpilot, Google).
            <br />
            It can be disabled in the <Link href="/rules">Rules</Link> tab.
          </ItemDescription>
        </ItemContent>
      </Item >
      <div className={cn("space-y-4 relative transition-all", showInfo ? "-translate-y-6" : "-translate-y-35")}>
        <Card >
          <Button size="icon" variant="ghost" onClick={() => setShowInfo(!showInfo)} className="absolute top-2 right-2">
            <ChevronsUp className={cn("transition-transform", !showInfo && "rotate-180")} />
          </Button>
          <CardContent className="space-y-4">
            <form id="redirection-page-form" onSubmit={handleSubmit}>
              <FieldGroup className="w-full min-w-0 [container-type:normal]">
                <Controller
                  name="title"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field className="min-w-48" data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="redirection-page-form-title">
                        Titre
                      </FieldLabel>
                      <Input id="redirection-page-form-title" {...field} />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="buttonText"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field className="min-w-48" data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="redirection-page-form-buttonText">
                        Texte du bouton
                      </FieldLabel>
                      <Input id="redirection-page-form-buttonText" {...field} />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <TogglableField
                  form={form as unknown as UseFormReturn<TogglableForm>}
                  name="description"
                  label="Description text"
                  placeholder="Description text..."
                  useTextarea
                  formId="redirection-page-form"
                />
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
        {form.formState.isDirty && (
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => form.reset()}>
              Annuler
            </Button>
            <Button
              type="submit"
              form="redirection-page-form"
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? "Enregistrement…" : "Valider les changements"}
            </Button>
          </div>
        )}
      </div>
    </div >
  );
}

export const useRedirectionPageForm = () => {
  const queryClient = useQueryClient();

  const { data: defaultValues } = useQuery({
    queryKey: REDIRECTION_PAGE_QUERY_KEY,
    queryFn: () => getAll<FormSchema>("customization/redirection-page"),
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
      patch<FormSchema>("customization/redirection-page", data),
    onSuccess: (data) => {
      form.reset(data);
      queryClient.invalidateQueries({ queryKey: REDIRECTION_PAGE_QUERY_KEY });
      toast.success("Page redirection enregistrée");
    },
  });

  return { form, saveMutation };
};
