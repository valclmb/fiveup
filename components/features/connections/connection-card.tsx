"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemMedia } from "@/components/ui/item";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { MinusCircle } from "lucide-react";
import * as React from "react";

// ——— Composant compound type shadcn ———

function ConnectionCardRoot({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <Item
      variant="outline"
      className={cn(
        "w-full flex items-center justify-between bg-background z-20",
        className
      )}
      {...props}
    >
      {children}
    </Item>
  );
}

function ConnectionCardLogo({
  className,
  ...props
}: React.ComponentProps<typeof ItemMedia>) {
  return <ItemMedia variant="icon" className={cn(className)} {...props} />;
}

function ConnectionCardContent(props: React.ComponentProps<typeof ItemContent>) {
  return <ItemContent {...props} />;
}

function ConnectionCardActions(props: React.ComponentProps<typeof ItemActions>) {
  return <ItemActions {...props} />;
}

type ConnectionCardDisconnectButtonProps = {
  onDisconnect: () => void;
  confirmTitle?: string;
  confirmDescription?: string;
};

function ConnectionCardDisconnectButton({
  onDisconnect,
  confirmTitle = "Are you sure?",
  confirmDescription = "The connection will be removed.",
}: ConnectionCardDisconnectButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="-translate-x-10 group-hover:translate-x-0"
              >
                <MinusCircle className="text-destructive" />
              </Button>
            </TooltipTrigger>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
              <AlertDialogDescription>{confirmDescription}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={onDisconnect}>
                Yes, disconnect
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <TooltipContent>Remove connection</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export const ConnectionCard = {
  Root: ConnectionCardRoot,
  Logo: ConnectionCardLogo,
  Content: ConnectionCardContent,
  Actions: ConnectionCardActions,
  DisconnectButton: ConnectionCardDisconnectButton,
};
