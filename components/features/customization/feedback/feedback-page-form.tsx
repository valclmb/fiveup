"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Item, ItemContent, ItemDescription, ItemMedia } from "@/components/ui/item";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { FEEDBACK_PAGE_QUERY_KEY } from "@/lib/feedback-page-queries";
import { getAll, patch } from "@/lib/fetch";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronsUp, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const togglableSchema = z.object({
  enabled: z.boolean(),
  content: z.string(),
});

const formSchema = z.object({
  title: z.string(),
  helpText: togglableSchema,
  reviewTag: togglableSchema,
  reviewTitle: togglableSchema,
  reviewComment: togglableSchema,
});

type FormSchema = z.infer<typeof formSchema>;

const DEFAULT_VALUES: FormSchema = {
  title: "How would you rate your experience?",
  helpText: { enabled: true, content: "Share your experience to help us improve." },
  reviewTag: { enabled: true, content: "What is the main subject of your feedback?" },
  reviewTitle: { enabled: true, content: "Give a title to your review" },
  reviewComment: { enabled: true, content: "Leave a comment" },
};

function TogglableField({
  form,
  name,
  label,
  placeholder,
  useTextarea = false,
  formId,
}: {
  form: UseFormReturn<FormSchema>;
  name: "helpText" | "reviewTag" | "reviewTitle" | "reviewComment";
  label: string;
  placeholder: string;
  useTextarea?: boolean;
  formId: string;
}) {
  const enabled = form.watch(`${name}.enabled`);
  const InputComponent = useTextarea ? Textarea : Input;
  const inputProps = useTextarea ? { rows: 3 } : {};

  return (
    <div className="space-y-2">
      <Controller
        name={`${name}.enabled`}
        control={form.control}
        render={({ field }) => (
          <Field className="flex flex-row items-center gap-2">
            <Switch
              id={`${formId}-${name}-enabled`}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <FieldLabel htmlFor={`${formId}-${name}-enabled`} className="cursor-pointer">
              {label}
            </FieldLabel>
          </Field>
        )}
      />
      <Controller
        name={`${name}.content`}
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <InputComponent
              id={`${formId}-${name}-content`}
              {...field}
              placeholder={placeholder}
              disabled={!enabled}
              className={useTextarea ? "max-h-32" : undefined}
              {...inputProps}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </div>
  );
}

export function FeedbackPageForm({
  form,
  saveMutation,
}: {
  form: UseFormReturn<FormSchema>;
  saveMutation: { mutate: (data: FormSchema) => void; isPending: boolean };
}) {
  const [showInfo, setShowInfo] = useState(true);
  const handleSubmit = form.handleSubmit((data) => saveMutation.mutate(data));
  const formId = "feedback-page-form";

  return (
    <div className="w-96">
      <Item className="pb-10" variant="outline">
        <ItemMedia variant="icon">
          <Info />
        </ItemMedia>
        <ItemContent>
          <ItemDescription className="line-clamp-none">
            This page is shown when a user leaves a negative review. It collects their feedback so they can share their experience with you directly, instead of posting it on review platforms (Trustpilot, Google, etc.).
          </ItemDescription>
        </ItemContent>
      </Item>
      <div className={cn("space-y-4 relative transition-all", showInfo ? "-translate-y-6" : "-translate-y-40")}>
        <Card className="relative">
          <Button size="icon" variant="ghost" onClick={() => setShowInfo(!showInfo)} className="absolute top-2 right-2 z-10">
            <ChevronsUp className={cn("transition-transform", !showInfo && "rotate-180")} />
          </Button>
          <CardContent className="space-y-4 pt-6">
            <form id={formId} onSubmit={handleSubmit}>
              <FieldGroup className="w-full min-w-0 [container-type:normal] space-y-4">
                <Controller
                  name="title"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field className="min-w-48" data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`${formId}-title`}>Titre</FieldLabel>
                      <Input id={`${formId}-title`} {...field} />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <TogglableField
                  form={form}
                  name="helpText"
                  label="Help text"
                  placeholder="Texte d'aide sous les étoiles..."
                  useTextarea
                  formId={formId}
                />
                <TogglableField
                  form={form}
                  name="reviewTag"
                  label="Review tag (sujet)"
                  placeholder="Label ou placeholder du champ tag..."
                  formId={formId}
                />
                <TogglableField
                  form={form}
                  name="reviewTitle"
                  label="Review title"
                  placeholder="Label du champ titre de l'avis..."
                  formId={formId}
                />
                <TogglableField
                  form={form}
                  name="reviewComment"
                  label="Review comment"
                  placeholder="Label du champ commentaire..."
                  useTextarea
                  formId={formId}
                />
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
      {form.formState.isDirty && (
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => form.reset()}>
            Annuler
          </Button>
          <Button
            type="submit"
            form={formId}
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? "Enregistrement…" : "Valider les changements"}
          </Button>
        </div>
      )}
    </div>
  );
}

export const useFeedbackPageForm = () => {
  const queryClient = useQueryClient();

  const { data: defaultValues } = useQuery({
    queryKey: FEEDBACK_PAGE_QUERY_KEY,
    queryFn: () => getAll<FormSchema>("customization/feedback-page"),
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
      patch<FormSchema>("customization/feedback-page", data),
    onSuccess: (data) => {
      form.reset(data);
      queryClient.invalidateQueries({ queryKey: FEEDBACK_PAGE_QUERY_KEY });
      toast.success("Page feedback enregistrée");
    },
  });

  return { form, saveMutation };
};
