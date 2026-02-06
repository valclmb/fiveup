"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";
import { Controller, UseFormReturn } from "react-hook-form";

export type ReviewTagSectionForm = {
  reviewTag: { enabled: boolean; content: string };
  reviewTagOptions: string[];
};

export type ReviewTagSectionProps = {
  form: UseFormReturn<ReviewTagSectionForm>;
  formId: string;
};

const MAX_SUBJECTS = 5;

export function ReviewTagSection({ form, formId }: ReviewTagSectionProps) {
  const enabled = form.watch("reviewTag.enabled");
  const options = form.watch("reviewTagOptions") ?? [];
  const canAdd = options.length < MAX_SUBJECTS;

  const append = () => {
    if (!canAdd) return;
    form.setValue("reviewTagOptions", [...options, ""], { shouldDirty: true });
  };
  const remove = (index: number) =>
    form.setValue(
      "reviewTagOptions",
      options.filter((_, i) => i !== index),
      { shouldDirty: true }
    );
  const update = (index: number, value: string) => {
    const next = [...options];
    next[index] = value;
    form.setValue("reviewTagOptions", next, { shouldDirty: true });
  };

  return (
    <div className="space-y-2">
      <Controller
        name="reviewTag.enabled"
        control={form.control}
        render={({ field }) => (
          <Field className="flex flex-row items-center gap-2">
            <Switch
              id={`${formId}-reviewTag-enabled`}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <FieldLabel htmlFor={`${formId}-reviewTag-enabled`} className="cursor-pointer">
              Show review subject
            </FieldLabel>
          </Field>
        )}
      />
      <Controller
        name="reviewTag.content"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel >Question</FieldLabel>
            <Input
              id={`${formId}-reviewTag-content`}
              {...field}
              placeholder="What is the main subject of your feedback?"
              disabled={!enabled}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      {enabled && (
        <>
          <FieldLabel>Enter a subject</FieldLabel>
          <div className="flex flex-col gap-2">
            {options.map((value, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={value}
                  onChange={(e) => update(index, e.target.value)}
                  placeholder="Sujet"
                  className="flex-1 min-w-0"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => remove(index)}
                  aria-label="Remove subject"
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={append}
            disabled={!canAdd}
          >
            Add a subject <span className="text-muted-foreground text-xs">{options.length > 0 && `(${options.length}/${MAX_SUBJECTS})`}</span>
          </Button>
        </>
      )}
    </div>
  );
}
