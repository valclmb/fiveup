"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Typography from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const IMPACT_OPTIONS = [
  { value: "low", label: "Low: Looking for information or guidance" },
  { value: "medium", label: "Medium: Issue affects me but doesn't block me" },
  { value: "high", label: "High: Work is blocked but sending still works" },
  { value: "critical", label: "Critical: Sending is interrupted or other critical impact" },
] as const;

const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"];

export default function HelpPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [impact, setImpact] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `${file.name} exceeds ${MAX_FILE_SIZE_MB}MB`;
    }
    const type = file.type.toLowerCase();
    if (!ALLOWED_TYPES.some((t) => type === t)) {
      const allowed = "JPEG, PNG, GIF, WebP, PDF";
      return `${file.name}: only ${allowed} are allowed`;
    }
    return null;
  };

  const addFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles?.length) return;
    const list = Array.from(newFiles);
    const next: File[] = [];
    for (const file of list) {
      if (next.length >= MAX_FILES) break;
      const err = validateFile(file);
      if (err) {
        toast.error(err);
        continue;
      }
      next.push(file);
    }
    setFiles((prev) => [...prev, ...next].slice(0, MAX_FILES));
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Front-only for now: no API call
    await new Promise((r) => setTimeout(r, 500));
    toast.success("Help request received. We'll get back to you soon.");
    setSubject("");
    setMessage("");
    setImpact("");
    setFiles([]);
    setIsSubmitting(false);
  };

  return (
    <div className="mx-auto max-w-2xl py-8">
      <Card className="border-border bg-card">
        <CardHeader className="space-y-1">
          <Typography variant="h2" className="text-xl font-bold leading-tight mt-0 mb-0">
            Contact Support
          </Typography>
          <Typography variant="p" affects="muted" className="text-muted-foreground leading-snug">
            Contact Support for any questions or issues you may have.
          </Typography>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="subject">Subject</FieldLabel>
                <Input
                  id="subject"
                  placeholder="Summary of the request"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="message">Message</FieldLabel>
                <Textarea
                  id="message"
                  placeholder="Please provide a thorough and precise description of the problem you are encountering, including any relevant details."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="min-h-[120px] resize-y"
                />
              </Field>

              <Field>
                <FieldLabel>Attachments</FieldLabel>
                <div
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-md border-2 border-dashed border-input-border bg-muted/30 px-4 py-8 text-center transition-colors",
                    isDragging && "border-primary/50 bg-primary/5"
                  )}
                >
                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,image/jpeg,image/png,image/gif,image/webp,application/pdf"
                    className="sr-only"
                    id="attachments"
                    onChange={(e) => addFiles(e.target.files)}
                  />
                  <label
                    htmlFor="attachments"
                    className="cursor-pointer text-sm text-muted-foreground"
                  >
                    Drag and drop files here, or{" "}
                    <span className="font-medium text-foreground underline">
                      click to select files
                    </span>
                    .
                  </label>
                  <Typography variant="p" affects="mutedDescription" className="mt-2 text-xs text-muted-foreground">
                    Upload up to {MAX_FILES} files, Max: {MAX_FILE_SIZE_MB}MB; JPEG, PNG, GIF, WebP, PDF.
                  </Typography>
                  {files.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {files.map((f, i) => (
                        <li
                          key={`${f.name}-${i}`}
                          className="flex items-center gap-1 rounded bg-muted px-2 py-1 text-xs"
                        >
                          <span className="truncate max-w-[120px]">{f.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(i)}
                            className="text-muted-foreground hover:text-foreground"
                            aria-label="Remove file"
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Field>

              <Field>
                <FieldLabel>What&apos;s the current impact?</FieldLabel>
                <Select value={impact} onValueChange={setImpact}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select impact" />
                  </SelectTrigger>
                  <SelectContent>
                    {IMPACT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending…" : "Send Help Request"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
