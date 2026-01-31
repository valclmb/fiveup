"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Controller, UseFormReturn } from "react-hook-form";

const TOGGLABLE_NAMES = ["helpText", "reviewTitle", "reviewComment", "description"] as const;
export type TogglableFieldName = (typeof TOGGLABLE_NAMES)[number];

export type TogglableForm = {
  helpText: { enabled: boolean; content: string };
  reviewTitle: { enabled: boolean; content: string };
  reviewComment: { enabled: boolean; content: string };
  description: { enabled: boolean; content: string };
};

export type TogglableFieldProps = {
  form: UseFormReturn<TogglableForm>;
  name: TogglableFieldName;
  label: string;
  placeholder: string;
  useTextarea?: boolean;
  formId: string;
};

export function TogglableField({
  form,
  name,
  label,
  placeholder,
  useTextarea = false,
  formId,
}: TogglableFieldProps) {
  const enabledPath = `${name}.enabled` as const;
  const contentPath = `${name}.content` as const;
  const enabled = form.watch(enabledPath);
  const InputComponent = useTextarea ? Textarea : Input;
  const inputProps = useTextarea ? { rows: 3 } : {};

  return (
    <div className="space-y-2">
      <Controller
        name={enabledPath}
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
        name={contentPath}
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
