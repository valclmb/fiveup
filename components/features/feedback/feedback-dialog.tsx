"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { FEEDBACK_CONSTANTS, FEEDBACK_MESSAGES } from "@/lib/feedback";
import Link from "next/link";
import { useCallback, useState, useTransition } from "react";
import { toast } from "sonner";

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const trimmedMessage = message.trim();

      // Validation côté client
      if (!trimmedMessage) {
        toast.error(FEEDBACK_MESSAGES.EMPTY_MESSAGE);
        return;
      }

      if (trimmedMessage.length > FEEDBACK_CONSTANTS.MAX_MESSAGE_LENGTH) {
        toast.error(FEEDBACK_MESSAGES.SUBMIT_ERROR);
        return;
      }

      // Soumission asynchrone
      startTransition(async () => {
        try {
          const response = await fetch("/api/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: trimmedMessage,
              pageUrl: window.location.href,
            }),
          });

          const data = await response.json().catch(() => ({}));

          if (!response.ok) {
            const errorMessage =
              response.status === 429
                ? data.error || FEEDBACK_MESSAGES.SUBMIT_ERROR
                : data.error || FEEDBACK_MESSAGES.SUBMIT_ERROR;

            toast[response.status === 429 ? "info" : "error"](errorMessage);
            return;
          }

          toast.success(FEEDBACK_MESSAGES.SUCCESS);
          setMessage("");
          onOpenChange(false);
        } catch {
          toast.error(FEEDBACK_MESSAGES.SUBMIT_ERROR);
        }
      });
    },
    [message, onOpenChange]
  );

  const handleMessageChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(e.target.value.slice(0, FEEDBACK_CONSTANTS.MAX_MESSAGE_LENGTH));
    },
    []
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="top-14 left-auto right-8 translate-x-0 translate-y-0 gap-4 p-6 sm:max-w-md"
        overlayClassName="bg-black/5 !backdrop-blur-none"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Textarea
            placeholder="Ideas to improve this page..."
            value={message}
            onChange={handleMessageChange}
            maxLength={FEEDBACK_CONSTANTS.MAX_MESSAGE_LENGTH}
            rows={5}
            className="min-h-24 resize-none rounded-lg bg-muted/50"
            disabled={isPending}
          />
          <div className="flex items-center justify-between gap-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Sending…" : "Send"}
            </Button>
            <p className="text-muted-foreground text-sm">
              Need more help?{" "}
              <Link
                href="/help"
                className="text-primary underline-offset-4 hover:underline"
              >
                Contact us
              </Link>
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}