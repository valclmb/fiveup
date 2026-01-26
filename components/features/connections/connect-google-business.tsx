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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Typography from "@/components/ui/typography";
import { getAll } from "@/lib/fetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MinusCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface GoogleBusinessAccount {
  id: string;
  accountName: string;
  locationName: string | null;
  createdAt: string;
  updatedAt: string;
}

export function ConnectGoogleBusiness() {
  const queryClient = useQueryClient();

  const { data: account, isLoading } = useQuery({
    queryKey: ["google-business-account"],
    queryFn: () => getAll<{ account: GoogleBusinessAccount | null }>("/google-business/account"),
    select: (data) => data.account,
  });

  console.log(account)

  const disconnect = useMutation({
    mutationFn: async () => {
      toast.loading("Déconnexion de Google Business...");
      const response = await fetch("/api/google-business/account", {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to disconnect");
      return response.json();
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Google Business déconnecté");
      queryClient.invalidateQueries({ queryKey: ["google-business-account"] });
    },
    onError: () => {
      toast.dismiss();
      toast.error("Erreur lors de la déconnexion");
    },
  });

  return (
    <div className="flex items-center gap-2 group">
      <Item variant="outline" className="max-w-max bg-background z-20">
        <ItemMedia variant="icon">
          <Image
            src="/images/google-logo.svg"
            alt="Google Business"
            width={90}
            height={24}
          />
        </ItemMedia>

        <ConnectGoogleBusinessContent account={account} isLoading={isLoading} />
      </Item>

      {account && (
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
                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Five Up sera déconnecté de votre compte Google Business.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => disconnect.mutate()}
                  >
                    Oui, déconnecter
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <TooltipContent>Supprimer la connexion</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

export default ConnectGoogleBusiness;

interface ConnectGoogleBusinessContentProps {
  account: GoogleBusinessAccount | null | undefined;
  isLoading: boolean;
}

const ConnectGoogleBusinessContent = ({
  account,
  isLoading,
}: ConnectGoogleBusinessContentProps) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    if (isConnecting) return;
    setIsConnecting(true);
    window.location.href = "/api/google-business/auth";
  };

  if (isLoading)
    return (
      <div className="flex gap-2">
        <Skeleton className="min-w-60 h-10" />
        <Skeleton className="w-20 h-10" />
      </div>
    );

  if (!account) {
    return (
      <>

        <ItemActions>
          <Button onClick={handleConnect} disabled={isConnecting}>
            {isConnecting ? <Spinner /> : "Connecter"}
          </Button>
        </ItemActions>
      </>
    );
  }

  return (
    <>
      <ItemContent>
        <Typography variant="p" className="font-bold">
          {account.locationName || account.accountName}
        </Typography>
      </ItemContent>
      <ItemActions>
        <Badge variant="outline">
          <div className="size-2 bg-primary rounded-full" /> Connected
        </Badge>
      </ItemActions>
    </>
  );
};
