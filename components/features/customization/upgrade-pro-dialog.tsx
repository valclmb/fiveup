"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Lock } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";

type MutationLike<T> = {
  mutate: (data: T, options?: { onSuccess?: () => void }) => void;
  isPending: boolean;
};

/**
 * Dialog shown when a free user tries to save customization.
 * Same message as dashboard "Upgrade to Pro to unlock".
 */
export function UpgradeProDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm" showCloseButton>
        <DialogHeader>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="rounded-full bg-primary/10 p-3">
              <Lock className="size-6 text-primary" aria-hidden />
            </div>
            <DialogTitle className="text-base">
              Upgrade to Pro to unlock
            </DialogTitle>
            <DialogDescription className="text-sm">
              Save your customization by upgrading to Pro. Get full access to all
              features.
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="flex justify-center pt-2">
          <Button asChild size="sm">
            <Link href="/pricing" onClick={() => onOpenChange(false)}>
              View plans
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Wraps a save mutation: when user is free, opening the upgrade dialog instead of saving.
 * Use the returned mutate + isPending in the form, and render UpgradeProDialog with the returned open state.
 */
export function useProGateSave<T>(saveMutation: MutationLike<T>) {
  const { data: session } = authClient.useSession();
  const plan = (session?.user as { plan?: string } | undefined)?.plan ?? "free";
  const isFree = plan === "free";

  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);

  const mutate = useCallback(
    (data: T, options?: { onSuccess?: () => void }) => {
      if (isFree) {
        setUpgradeDialogOpen(true);
        return;
      }
      saveMutation.mutate(data, options);
    },
    [isFree, saveMutation]
  );

  return {
    mutate,
    isPending: saveMutation.isPending,
    upgradeDialogOpen,
    setUpgradeDialogOpen,
  };
}
