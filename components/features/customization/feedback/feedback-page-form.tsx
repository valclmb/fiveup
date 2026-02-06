"use client";

import type { TogglableForm } from "@/components/features/customization/togglable-field";
import { TogglableField } from "@/components/features/customization/togglable-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Item, ItemContent, ItemDescription, ItemMedia } from "@/components/ui/item";
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
import type { ReviewTagSectionForm } from "./review-tag-section";
import { ReviewTagSection } from "./review-tag-section";

const togglableSchema = z.object({
  enabled: z.boolean(),
  content: z.string(),
});

const formSchema = z.object({
  title: z.string(),
  helpText: togglableSchema,
  reviewTag: togglableSchema,
  reviewTagOptions: z.array(z.string()),
  reviewTitle: togglableSchema,
  reviewComment: togglableSchema,
});

type FormSchema = z.infer<typeof formSchema>;

const DEFAULT_SUBJECTS = [
  "Product quality",
  "Delivery",
  "Customer service",
  "Overall experience",
  "Other",
];

const DEFAULT_VALUES: FormSchema = {
  title: "How would you rate your experience?",
  helpText: { enabled: true, content: "Share your experience to help us improve." },
  reviewTag: { enabled: true, content: "What is the main subject of your feedback?" },
  reviewTagOptions: [...DEFAULT_SUBJECTS],
  reviewTitle: { enabled: true, content: "Give a title to your review" },
  reviewComment: { enabled: true, content: "Leave a comment" },
};

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
    <div className="max-w-[500px]">
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
      <div className={cn("space-y-4 relative transition-all", showInfo ? "-translate-y-6" : "-translate-y-35")}>
        <Card className="relative">
          <Button size="icon" variant="ghost" onClick={() => setShowInfo(!showInfo)} className="absolute top-2 right-2 z-10">
            <ChevronsUp className={cn("transition-transform", !showInfo && "rotate-180")} />
          </Button>
          <CardContent >
            <form id={formId} onSubmit={handleSubmit}>
              <FieldGroup className="w-full min-w-0 [container-type:normal]">
                <Controller
                  name="title"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field className="min-w-48" data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`${formId}-title`}>Title</FieldLabel>
                      <Input id={`${formId}-title`} {...field} />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <TogglableField
                  form={form as unknown as UseFormReturn<TogglableForm>}
                  name="helpText"
                  label="Help text"
                  placeholder="Help text under the stars..."
                  formId={formId}
                />
                <ReviewTagSection form={form as unknown as UseFormReturn<ReviewTagSectionForm>} formId={formId} />
                <TogglableField
                  form={form as unknown as UseFormReturn<TogglableForm>}
                  name="reviewTitle"
                  label="Review title"
                  placeholder="Label du champ titre de l'avis..."
                  formId={formId}
                />
                <TogglableField
                  form={form as unknown as UseFormReturn<TogglableForm>}
                  name="reviewComment"
                  label="Review comment"
                  placeholder="Label du champ commentaire..."
                  formId={formId}
                />
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
        {form.formState.isDirty && (
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => form.reset()}>
              Cancel
            </Button>
            <Button
              type="submit"
              form={formId}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? "Saving…" : "Save changes"}
            </Button>
          </div>
        )}
      </div>
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
      toast.success("Feedback page saved");
    },
  });

  return { form, saveMutation };
};
