"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  DELAY_UNITS,
  DELAY_VALUES,
  MESSAGE_VARIABLES,
  TRIGGER_ICONS,
  TRIGGER_TYPES,
  hoursToValueAndUnit,
  type ChannelValue,
  type TriggerType,
} from "@/lib/campaigns";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { ChannelSelectCards } from "./channel-select-cards";

const campaignConfigSchema = z.object({
  delayValue: z.number().min(1, "Delay must be at least 1"),
  delayUnit: z.enum(["hours", "days", "weeks"]),
  triggerType: z.enum(["purchase", "shipment", "receipt"]),
  channel: z.enum(["email", "sms", "whatsapp"]),
  messageContent: z
    .string()
    .min(1, "Message cannot be empty")
    .refine((val) => val.trim().length > 0, "Message cannot be empty or only whitespace"),
  thanksMessageEnabled: z.boolean(),
  thanksMessageContent: z.string(),
});

export type CampaignConfigFormValues = z.infer<typeof campaignConfigSchema>;

export interface CampaignConfigFormProps {
  userCampaign: {
    delayHours: number;
    channel: string;
    messageContent: string | null;
    thanksMessageEnabled?: boolean;
    thanksMessageContent: string | null;
    triggerType?: string;
  } | null;
  step: number;
  onStepChange: (s: number) => void;
  onSave: (data: CampaignConfigFormValues) => Promise<void>;
  isSaving: boolean;
}

const DEFAULT_MESSAGE =
  "Hi {{customer_first_name}}, thank you for your order {{order_number}}! Share your experience: {{review_link}}";

const DEFAULT_THANKS_MESSAGE =
  "Thank you for your feedback! Your review helps us improve and helps other customers make informed decisions.";

function getDefaultValues(userCampaign: CampaignConfigFormProps["userCampaign"]): CampaignConfigFormValues {
  const defaultDelay = hoursToValueAndUnit(userCampaign?.delayHours ?? 24);
  return {
    delayValue: defaultDelay.value,
    delayUnit: defaultDelay.unit,
    triggerType: (userCampaign?.triggerType as TriggerType) ?? "purchase",
    channel: (userCampaign?.channel as ChannelValue) ?? "email",
    messageContent:
      (userCampaign?.messageContent ?? "").trim() || DEFAULT_MESSAGE,
    thanksMessageEnabled: userCampaign?.thanksMessageEnabled ?? true,
    thanksMessageContent:
      (userCampaign?.thanksMessageContent ?? "").trim() || DEFAULT_THANKS_MESSAGE,
  };
}

export function CampaignConfigForm({
  userCampaign,
  step,
  onStepChange,
  onSave,
  isSaving,
}: CampaignConfigFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const form = useForm<CampaignConfigFormValues>({
    resolver: zodResolver(campaignConfigSchema),
    defaultValues: getDefaultValues(userCampaign),
  });

  const delayUnit = form.watch("delayUnit");
  const delayOptions = DELAY_VALUES[delayUnit];

  useEffect(() => {
    form.reset(getDefaultValues(userCampaign));
  }, [userCampaign, form]);

  const accordionValues = ["time", "channel", "message", "thanks-message"] as const;

  const insertVariable = (variable: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = form.getValues("messageContent");
    const newText = text.slice(0, start) + variable + text.slice(end);
    form.setValue("messageContent", newText);
    el.focus();
    setTimeout(() => {
      el.setSelectionRange(start + variable.length, start + variable.length);
    }, 0);
  };

  const handleSave = form.handleSubmit((data) => onSave(data));

  return (
    <Accordion
      type="single"
      value={accordionValues[step]}
      onValueChange={(v) => {
        const idx = accordionValues.indexOf(v as (typeof accordionValues)[number]);
        if (idx >= 0) onStepChange(idx);
      }}
      collapsible
      className="gap-6"
    >
      <AccordionItem value="time">
        <AccordionTrigger className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-accent text-accent-foreground text-lg font-bold">
            1
          </div>
          When will the message be sent?
        </AccordionTrigger>
        <AccordionContent className="space-y-6 pt-2">
          <FieldGroup>
            <Controller
              name="triggerType"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Shopify trigger</FieldLabel>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {TRIGGER_TYPES.map((t) => {
                      const Icon = TRIGGER_ICONS[t.value];
                      const isSelected = field.value === t.value;
                      return (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => field.onChange(t.value)}
                          className={cn(
                            "relative flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors",
                            "hover:border-primary/50 hover:bg-muted/50",
                            isSelected
                              ? "border-primary bg-primary/5"
                              : "border-border bg-card"
                          )}
                        >
                          <div className="absolute right-2 top-2">
                            <div
                              className={cn(
                                "flex size-5 items-center justify-center rounded-full border-2 transition-colors",
                                isSelected
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground/30"
                              )}
                            >
                              {isSelected && (
                                <div className="size-2 rounded-full bg-primary-foreground" />
                              )}
                            </div>
                          </div>
                          <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                            <Icon className="size-6 text-muted-foreground" />
                          </div>
                          <span className="text-center text-sm font-medium">
                            {t.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </Field>
              )}
            />
            <Field>
              <FieldLabel>Delay</FieldLabel>
              <div className="flex gap-2">
                <Controller
                  name="delayValue"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      value={String(field.value)}
                      onValueChange={(v) => field.onChange(Number(v))}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {delayOptions.map((v) => (
                          <SelectItem key={v} value={String(v)}>
                            {v}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Controller
                  name="delayUnit"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(v) => {
                        const newUnit = v as "hours" | "days" | "weeks";
                        const opts = DELAY_VALUES[newUnit];
                        const currentValue = form.getValues("delayValue");
                        if (!opts.includes(currentValue as never)) {
                          form.setValue("delayValue", opts[0]);
                        }
                        field.onChange(newUnit);
                      }}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DELAY_UNITS.map((u) => (
                          <SelectItem key={u.value} value={u.value}>
                            {u.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </Field>
          </FieldGroup>
          <div className="flex justify-end">
            <Button type="button" onClick={() => onStepChange(1)}>
              Next <ArrowRight className="size-4" />
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="channel">
        <AccordionTrigger className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-accent text-accent-foreground text-lg font-bold">
            2
          </div>
          Sending channel
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          <FieldGroup>
            <Controller
              name="channel"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Channel</FieldLabel>
                  <FieldDescription>
                    Where do you want to send the review request?
                  </FieldDescription>
                  <ChannelSelectCards value={field.value} onChange={field.onChange} />
                </Field>
              )}
            />
          </FieldGroup>
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => onStepChange(0)}>
              Back
            </Button>
            <Button type="button" onClick={() => onStepChange(2)}>
              Next <ArrowRight className="size-4" />
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="message">
        <AccordionTrigger className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-accent text-accent-foreground text-lg font-bold">
            3
          </div>
          Review request message
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          <FieldGroup>
            <Controller
              name="messageContent"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="campaign-message-content">
                    Message content
                  </FieldLabel>
                  <Textarea
                    id="campaign-message-content"
                    ref={(el) => {
                      field.ref(el);
                      textareaRef.current = el;
                    }}
                    placeholder={DEFAULT_MESSAGE}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    aria-invalid={fieldState.invalid}
                    className="min-h-32"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  <FieldDescription className="mb-0! pt-2">
                    Click to insert a variable into your message.
                  </FieldDescription>
                  <div className="flex flex-wrap gap-2">
                    {MESSAGE_VARIABLES.map((v) => (
                      <Button
                        key={v.key}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => insertVariable(v.key)}
                      >
                        {v.label}
                      </Button>
                    ))}
                  </div>

                </Field>
              )}
            />
          </FieldGroup>
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => onStepChange(1)}>
              Back
            </Button>
            <Button type="button" onClick={() => onStepChange(3)}>
              Next <ArrowRight className="size-4" />
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="thanks-message">
        <AccordionTrigger className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-accent text-accent-foreground text-lg font-bold">
            4
          </div>
          Post-review thank you message
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">


          <FieldGroup>
            <Field>
              <FieldDescription>
                Sent via the same channel after the customer submits their review.
              </FieldDescription>
              <Controller
                name="thanksMessageEnabled"
                control={form.control}
                render={({ field }) => (
                  <Field className="flex-row">
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <FieldLabel>Enable</FieldLabel>
                  </Field>
                )}
              />
            </Field>


            <Controller
              name="thanksMessageContent"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="campaign-thanks-message-content">
                    Thank you message content
                  </FieldLabel>
                  <Textarea
                    id="campaign-thanks-message-content"
                    placeholder={DEFAULT_THANKS_MESSAGE}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    className="min-h-32"
                    disabled={!form.watch("thanksMessageEnabled")}
                  />
                  <FieldDescription className="mb-0! pt-2">
                    Click to insert a variable into your message.
                  </FieldDescription>
                  <div className="flex flex-wrap gap-2 mt-0">

                    {MESSAGE_VARIABLES.map((v) => (
                      <Button
                        key={v.key}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const el = document.getElementById("campaign-thanks-message-content") as HTMLTextAreaElement | null;
                          if (!el || !form.watch("thanksMessageEnabled")) return;
                          const start = el.selectionStart;
                          const end = el.selectionEnd;
                          const text = form.getValues("thanksMessageContent");
                          const newText = text.slice(0, start) + v.key + text.slice(end);
                          form.setValue("thanksMessageContent", newText);
                          el.focus();
                          setTimeout(() => {
                            el.setSelectionRange(start + v.key.length, start + v.key.length);
                          }, 0);
                        }}
                        disabled={!form.watch("thanksMessageEnabled")}
                      >
                        {v.label}
                      </Button>
                    ))}
                  </div>

                </Field>
              )}
            />
          </FieldGroup>
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => onStepChange(2)}>
              Back
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion >
  );
}
