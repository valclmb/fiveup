"use client";

import { ConnectionCard } from "@/components/features/connections/connection-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShineBorder } from "@/components/ui/shine-border";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import Typography from "@/components/ui/typography";
import { getAll } from "@/lib/fetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  const [isConnecting, setIsConnecting] = useState(false);

  const { data: account, isLoading } = useQuery({
    queryKey: ["google-business-account"],
    queryFn: () =>
      getAll<{ account: GoogleBusinessAccount | null }>(
        "/google-business/account"
      ),
    select: (data) => data.account,
  });

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

  const handleConnect = () => {
    setIsConnecting(true);
    window.location.href = "/api/google-business/auth";
  };

  return (
    <div className="flex w-full items-center gap-2 group">
      <ConnectionCard.Root>
        <ShineBorder borderWidth={1} shineColor={["var(--primary)", "yellow", "cyan"]} />

        <ConnectionCard.Logo>
          <Image
            src="/images/google-logo.svg"
            alt="Google Business"
            width={80}
            height={24}
            className="object-contain"
          />
        </ConnectionCard.Logo>
        {account && (
          <ConnectionCard.Content>
            <Typography variant="p" className="font-bold">
              {account.locationName || account.accountName}
            </Typography>
          </ConnectionCard.Content>
        )}
        <ConnectionCard.Actions>
          {isLoading ? (
            <Skeleton className="h-9 w-24" />
          ) : account ? (
            <Badge variant="outline">
              <div className="size-2 bg-primary rounded-full" /> Connected
            </Badge>
          ) : (
            <Button onClick={handleConnect} disabled={isConnecting}>
              {isConnecting ? <Spinner /> : "Connecter"}
            </Button>
          )}
        </ConnectionCard.Actions>
      </ConnectionCard.Root>
      {account && (
        <ConnectionCard.DisconnectButton
          onDisconnect={() => disconnect.mutate()}
          confirmTitle="Êtes-vous sûr ?"
          confirmDescription="Five Up sera déconnecté de votre compte Google Business."
        />
      )}
    </div>
  );
}

export default ConnectGoogleBusiness;
