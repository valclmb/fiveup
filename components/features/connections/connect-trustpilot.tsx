"use client";

import { ConnectionCard } from "@/components/features/connections/connection-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ShineBorder } from "@/components/ui/shine-border";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import Typography from "@/components/ui/typography";
import { getAll } from "@/lib/fetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock, Star, Unplug } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface TrustpilotAccount {
  id: string;
  businessUrl: string;
  businessDomain: string;
  companyName: string | null;
  trustScore: number | null;
  totalReviews: number | null;
  profileImageUrl: string | null;
  lastSyncAt: string | null;
  reviewsStored: number;
}

interface TrustpilotSync {
  id: string;
  status: "PENDING" | "RUNNING" | "SUCCEEDED" | "FAILED";
  reviewsCount: number | null;
  startedAt: string;
  finishedAt: string | null;
  error: string | null;
}

interface AccountResponse {
  connected: boolean;
  hasAccount: boolean;
  account?: TrustpilotAccount & {
    canChangeDomain: boolean;
    daysUntilDomainChange: number;
  };
  latestSync?: TrustpilotSync | null;
}

interface ConnectResponse {
  success: boolean;
  syncId?: string;
  status: string;
  reviewsCount?: number;
  message?: string;
}

interface StatusResponse {
  syncId: string;
  status: string;
  error?: string;
  reviewsCount?: number;
}

export function ConnectTrustpilot() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [syncId, setSyncId] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["trustpilot-account"],
    queryFn: () => getAll<AccountResponse>("/trustpilot/account"),
  });

  const account = data?.account;
  const latestSync = data?.latestSync;
  const isConnected = data?.connected ?? false;
  const hasAccount = data?.hasAccount ?? false;
  const canChangeDomain = account?.canChangeDomain ?? true;
  const daysUntilDomainChange = account?.daysUntilDomainChange ?? 0;

  // Check if there's an ongoing sync on mount
  useEffect(() => {
    if (latestSync && ["PENDING", "RUNNING"].includes(latestSync.status)) {
      setSyncId(latestSync.id);
      setIsPolling(true);
    }
  }, [latestSync]);

  // Polling logic
  const pollStatus = useCallback(async () => {
    if (!syncId) return;

    try {
      const response = await fetch(`/api/trustpilot/status?syncId=${syncId}`);
      const data: StatusResponse = await response.json();

      if (data.status === "SUCCEEDED") {
        setIsPolling(false);
        setSyncId(null);
        queryClient.invalidateQueries({ queryKey: ["trustpilot-account"] });
        toast.success(`Sync completed! ${data.reviewsCount ?? 0} reviews imported.`);
      } else if (data.status === "FAILED") {
        setIsPolling(false);
        setSyncId(null);
        queryClient.invalidateQueries({ queryKey: ["trustpilot-account"] });
        toast.error(`Sync failed: ${data.error ?? "Unknown error"}`);
      }
    } catch (error) {
      console.error("Polling error:", error);
    }
  }, [syncId, queryClient]);

  useEffect(() => {
    if (!isPolling || !syncId) return;

    const interval = setInterval(pollStatus, 6000);
    return () => clearInterval(interval);
  }, [isPolling, syncId, pollStatus]);

  const connect = useMutation({
    mutationFn: async (businessUrl: string) => {
      const response = await fetch("/api/trustpilot/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: businessUrl }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to connect");
      }
      return response.json() as Promise<ConnectResponse>;
    },
    onSuccess: (data) => {
      setDialogOpen(false);
      setUrl("");
      queryClient.invalidateQueries({ queryKey: ["trustpilot-account"] });

      if (data.status === "RECONNECTED") {
        toast.success(data.message || "Account reconnected!");
      } else if (data.syncId) {
        setSyncId(data.syncId);
        setIsPolling(true);
        toast.info("Syncing Trustpilot reviews... This may take a few minutes.");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const disconnect = useMutation({
    mutationFn: async () => {
      toast.loading("Disconnecting from Trustpilot...");
      const response = await fetch("/api/trustpilot/account", {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to disconnect");
      return response.json();
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Trustpilot disconnected");
      queryClient.invalidateQueries({ queryKey: ["trustpilot-account"] });
    },
    onError: () => {
      toast.dismiss();
      toast.error("Error during disconnection");
    },
  });

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error("Please enter a Trustpilot URL or domain");
      return;
    }
    connect.mutate(url.trim());
  };

  const handleReconnect = () => {
    if (account) {
      connect.mutate(account.businessUrl);
    }
  };

  const isSyncing = isPolling || (latestSync && ["PENDING", "RUNNING"].includes(latestSync.status));

  return (
    <div className="flex w-full items-center gap-2 group">
        <ConnectionCard.Root>
          <ShineBorder
            borderWidth={1}
            shineColor={["#00b67a", "#00d884", "#00b67a"]}
          />

          <ConnectionCard.Logo>
            <Image
              src="/images/trustpilot-logo.svg"
              alt="Trustpilot"
              width={100}
              height={24}
              className="object-contain dark:hidden"
            />
            <Image
              src="/images/trustpilot-logo-dark.svg"
              alt="Trustpilot"
              width={100}
              height={24}
              className="object-contain hidden dark:block"
            />
          </ConnectionCard.Logo>

          {/* Only show account info if connected */}
          {isConnected && account && (
            <ConnectionCard.Content>
              <div className="flex flex-col gap-1">
                <Typography variant="p" className="font-bold">
                  {account.companyName || account.businessDomain}
                </Typography>
                {account.trustScore && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="size-4 fill-[#00b67a] text-[#00b67a]" />
                      <span>{account.trustScore.toFixed(1)}</span>
                    </div>
                    <span>•</span>
                    <span>{account.reviewsStored} reviews</span>
                  </div>
                )}
                {isSyncing && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Spinner className="size-3" />
                    <span>Syncing...</span>
                  </div>
                )}
              </div>
            </ConnectionCard.Content>
          )}

          <ConnectionCard.Actions>
            {isLoading ? (
              <Skeleton className="h-9 w-24" />
            ) : isConnected ? (
              <Badge variant="outline">
                <div className="size-2 bg-[#00b67a] rounded-full" /> Connected
              </Badge>
            ) : (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Connecter</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Connect Trustpilot</DialogTitle>
                    <DialogDescription>
                      Enter your Trustpilot business URL or domain to import your reviews.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleConnect} className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        placeholder="example.com or trustpilot.com/review/example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        disabled={connect.isPending || !canChangeDomain}
                      />
                      {!canChangeDomain && (
                        <div className="flex items-center gap-2 text-xs text-orange-500">
                          <Clock className="size-3" />
                          <span>
                            You can change domain in {daysUntilDomainChange} day(s).
                          </span>
                        </div>
                      )}
                      {canChangeDomain && (
                        <Typography variant="description" className="text-xs">
                          You can enter just the domain (example.com) or the full Trustpilot URL.
                        </Typography>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={connect.isPending || !url.trim() || !canChangeDomain}
                    >
                      {connect.isPending ? (
                        <>
                          <Spinner className="mr-2" />
                          Connecting...
                        </>
                      ) : (
                        "Connect & Import Reviews"
                      )}
                    </Button>

                    {/* Reconnect disconnected account */}
                    {hasAccount && account && (
                      <>
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                              or
                            </span>
                          </div>
                        </div>

                        <Card className="border-orange-500/30 bg-orange-500/5">
                          <CardContent className="py-3">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <Unplug className="size-4 text-orange-500" />
                                <div className="text-sm">
                                  <span className="font-medium">
                                    {account.companyName || account.businessDomain}
                                  </span>
                                  <span className="text-muted-foreground ml-1">
                                    ({account.reviewsStored} reviews)
                                  </span>
                                </div>
                              </div>
                              <Button
                                type="button"
                                onClick={handleReconnect}
                                disabled={connect.isPending}
                                size="sm"
                                variant="outline"
                              >
                                {connect.isPending ? (
                                  <Spinner className="size-4" />
                                ) : (
                                  "Reconnect"
                                )}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    )}
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </ConnectionCard.Actions>
        </ConnectionCard.Root>

        {isConnected && account && (
          <ConnectionCard.DisconnectButton
            onDisconnect={() => disconnect.mutate()}
            confirmTitle="Disconnect Trustpilot?"
            confirmDescription="Your reviews will be kept. You can reconnect the same domain anytime without re-syncing."
          />
        )}
    </div>
  );
}

export default ConnectTrustpilot;
