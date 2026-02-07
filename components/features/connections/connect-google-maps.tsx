"use client";

import { ConnectionCard } from "@/components/features/connections/connection-card";
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
import { GOOGLE_REVIEWS_CONSTANTS } from "@/lib/reviews/google-constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MapPin, Star, Unplug } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface GoogleAccountResponse {
  connected: boolean;
  hasAccount: boolean;
  account?: {
    id: string;
    businessUrl: string | null;
    placeId: string;
    companyName: string | null;
    trustScore: number | null;
    totalReviews: number | null;
    reviewsStored: number;
    stats?: { total?: number | null };
  };
  latestSync?: {
    id: string;
    status: string;
    reviewsCount: number | null;
    startedAt: string;
    finishedAt: string | null;
    error: string | null;
  } | null;
}

interface ConnectResponse {
  success: boolean;
  accountId?: string;
  syncId?: string;
  status: string;
  message?: string;
  reviewsCount?: number;
}

export function ConnectGoogleMaps() {
  const queryClient = useQueryClient();
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [connectedDialogOpen, setConnectedDialogOpen] = useState(false);
  const [placeInput, setPlaceInput] = useState("");
  const [syncId, setSyncId] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["google-reviews-account"],
    queryFn: () => getAll<GoogleAccountResponse>("reviews/google/account"),
  });

  const account = data?.account;
  const latestSync = data?.latestSync;
  const isConnected = data?.connected ?? false;
  const hasAccount = data?.hasAccount ?? false;

  useEffect(() => {
    if (latestSync && ["PENDING", "RUNNING"].includes(latestSync.status)) {
      setSyncId(latestSync.id);
      setIsPolling(true);
    }
  }, [latestSync]);

  const pollStatus = useCallback(async () => {
    if (!syncId) return;

    try {
      const response = await fetch(`/api/reviews/google/status?syncId=${syncId}`);
      const data = await response.json();

      if (data.status === "SUCCEEDED") {
        setIsPolling(false);
        setSyncId(null);
        queryClient.invalidateQueries({ queryKey: ["google-reviews-account"] });
        queryClient.invalidateQueries({ queryKey: ["google-reviews"] });
        toast.success(`Sync completed! ${data.reviewsCount ?? 0} reviews imported.`);
      } else if (data.status === "FAILED") {
        setIsPolling(false);
        setSyncId(null);
        queryClient.invalidateQueries({ queryKey: ["google-reviews-account"] });
        queryClient.invalidateQueries({ queryKey: ["google-reviews"] });
        toast.error(`Sync failed: ${data.error ?? "Unknown error"}`);
      }
    } catch (error) {
      console.error("Polling error:", error);
    }
  }, [syncId, queryClient]);

  useEffect(() => {
    if (!isPolling || !syncId) return;

    const interval = setInterval(
      pollStatus,
      GOOGLE_REVIEWS_CONSTANTS.SYNC_POLL_INTERVAL_MS
    );
    return () => clearInterval(interval);
  }, [isPolling, syncId, pollStatus]);

  const connect = useMutation({
    mutationFn: async (input: string) => {
      const placeIds = input
        .split(/[\n,;]/)
        .map((p) => p.trim())
        .filter(Boolean);
      if (placeIds.length === 0) throw new Error("No valid place ID or URL");
      const response = await fetch("/api/reviews/google/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeIds }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to connect");
      }
      return response.json() as Promise<ConnectResponse>;
    },
    onSuccess: (data) => {
      setConnectDialogOpen(false);
      setPlaceInput("");
      queryClient.invalidateQueries({ queryKey: ["google-reviews-account"] });
      queryClient.invalidateQueries({ queryKey: ["google-reviews"] });

      if (data.status === "RECONNECTED") {
        toast.success(data.message || "Account reconnected!");
      } else if (data.syncId) {
        setSyncId(data.syncId);
        setIsPolling(true);
        toast.info("Syncing Google Maps reviews... This may take a few minutes.");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const disconnect = useMutation({
    mutationFn: async () => {
      toast.loading("Disconnecting from Google Maps reviews...");
      const response = await fetch("/api/reviews/google/account", {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to disconnect");
      return response.json();
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Google Maps reviews disconnected");
      queryClient.invalidateQueries({ queryKey: ["google-reviews-account"] });
      queryClient.invalidateQueries({ queryKey: ["google-reviews"] });
    },
    onError: () => {
      toast.dismiss();
      toast.error("Error during disconnection");
    },
  });

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!placeInput.trim()) {
      toast.error("Please enter a Google Place ID or Maps URL");
      return;
    }
    connect.mutate(placeInput.trim());
  };

  const handleReconnect = () => {
    if (account?.placeId) {
      connect.mutate(account.placeId);
    }
  };

  const isSyncing = isPolling || (latestSync && ["PENDING", "RUNNING"].includes(latestSync.status));

  return (
    <div className="flex w-full items-center gap-2 group">
      <ConnectionCard.Root>
        <ShineBorder
          borderWidth={1}
          shineColor={["#4285f4", "#34a853", "#4285f4"]}
        />

        <ConnectionCard.Logo>
          <Image
            src="/images/google-logo.svg"
            alt="Google Maps"
            width={80}
            height={24}
            className="object-contain"
          />
        </ConnectionCard.Logo>

        <ConnectionCard.Actions>
          {isLoading ? (
            <Skeleton className="h-9 w-24" />
          ) : isConnected ? (
            <Dialog open={connectedDialogOpen} onOpenChange={setConnectedDialogOpen}>
              <DialogTrigger asChild>
                <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                  <div className="size-2 bg-[#4285f4] rounded-full" /> Connected
                </Badge>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Google Maps Reviews</DialogTitle>
                  <DialogDescription>
                    Your Google Maps reviews are connected.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <Typography variant="p" className="font-bold">
                      {account?.companyName || account?.placeId}
                    </Typography>
                    {account?.trustScore != null && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="size-4 fill-[#fbbc04] text-[#fbbc04]" />
                          <span>{account.trustScore.toFixed(1)}</span>
                        </div>
                        <span>•</span>
                        <span>
                          {(account?.stats?.total ?? account?.reviewsStored)} reviews
                        </span>
                      </div>
                    )}
                    {isSyncing && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Spinner className="size-3" />
                        <span>Syncing...</span>
                      </div>
                    )}
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        Disconnect
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Disconnect Google Maps Reviews?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Your reviews will be kept. You can reconnect the same place anytime.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          variant="destructive"
                          onClick={() => {
                            disconnect.mutate();
                            setConnectedDialogOpen(false);
                          }}
                        >
                          Yes, disconnect
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <Dialog open={connectDialogOpen} onOpenChange={setConnectDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <MapPin className="size-4" />
                  Connect
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Connect Google Maps Reviews</DialogTitle>
                  <DialogDescription>
                    Enter your Google Place ID or paste a Google Maps URL. Find your place ID in the Maps URL (place_id=ChIJ...).
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleConnect} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      placeholder="ChIJ... or https://maps.google.com/..."
                      value={placeInput}
                      onChange={(e) => setPlaceInput(e.target.value)}
                      disabled={connect.isPending}
                    />
                    <Typography variant="description" className="text-xs">
                      One place ID per line, or comma-separated.
                    </Typography>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={connect.isPending || !placeInput.trim()}
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
                                  {account.companyName || account.placeId}
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
    </div>
  );
}

export default ConnectGoogleMaps;
