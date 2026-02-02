"use client";

import { ConnectionCard } from "@/components/features/connections/connection-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { ShineBorder } from "@/components/ui/shine-border";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import Typography from "@/components/ui/typography";
import { getAll, post } from "@/lib/fetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export function ConnectShopify() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [shop, setShop] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const { data: store, isLoading } = useQuery({
    queryKey: ["shopify-stores"],
    queryFn: () => getAll("/shopify/stores"),
    select: (data) => data.stores[0],
  });

  const disconnect = useMutation({
    mutationFn: (storeId: string) => {
      toast.loading("Disconnecting Shopify store...");
      return post("/shopify/disconnect", { storeId });
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Shopify store disconnected successfully");
      queryClient.invalidateQueries({ queryKey: ["shopify-stores"] });
    },
  });

  const validateShopName = (value: string): string | null => {
    if (!value.trim()) return "Veuillez renseigner le nom de votre boutique.";
    const shopName = value.replace(".myshopify.com", "").trim();
    if (!/^[a-zA-Z0-9-]+$/.test(shopName)) {
      return "Invalid name. Use only letters, numbers and hyphens.";
    }
    return null;
  };

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateShopName(shop);
    if (error) {
      toast.error(error);
      return;
    }
    const shopName = shop.replace(".myshopify.com", "").trim();
    setIsConnecting(true);
    setModalOpen(false);
    setShop("");
    window.location.href = `/api/shopify/auth?shop=${encodeURIComponent(shopName)}`;
  };

  return (
    <div className="flex w-full items-center gap-2 group">
      <ConnectionCard.Root>
        <ShineBorder borderWidth={1} shineColor={["var(--primary)", "yellow", "cyan"]} />
        <ConnectionCard.Logo>
          <Image
            src="/images/shopify-logo.svg"
            alt="Shopify"
            width={110}
            height={24}
            className="object-contain"
          />
        </ConnectionCard.Logo>
        {store && (
          <ConnectionCard.Content>
            <Typography variant="p" className="font-bold">
              <Link
                href={`https://${store.shop}`}
                target="_blank"
                className="hover:underline"
              >
                {store.shop}
              </Link>
            </Typography>
          </ConnectionCard.Content>
        )}
        <ConnectionCard.Actions>
          {isLoading ? (
            <Skeleton className="h-9 w-24" />
          ) : store ? (
            <Badge variant="outline">
              <div className="size-2 bg-primary rounded-full" /> Connected
            </Badge>
          ) : (
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogTrigger asChild>
                <Button disabled={isConnecting}>
                  {isConnecting ? <Spinner /> : "Connecter"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleConnect}>
                  <DialogHeader>
                    <DialogTitle>Connecter Shopify</DialogTitle>
                    <DialogDescription>
                      Entrez le nom de votre boutique Shopify.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Field>
                      <InputGroup>
                        <InputGroupInput
                          placeholder="myshop"
                          value={shop}
                          onChange={(e) => setShop(e.target.value)}
                        />
                        <InputGroupAddon align="inline-end">
                          <InputGroupText>.myshopify.com</InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                    </Field>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isConnecting}>
                      {isConnecting ? <Spinner /> : "Connecter"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </ConnectionCard.Actions>
      </ConnectionCard.Root>
      {store && (
        <ConnectionCard.DisconnectButton
          onDisconnect={() => disconnect.mutate(store.id)}
          confirmTitle="Are you sure?"
          confirmDescription="Five Up will be disconnected from your store."
        />
      )}
    </div>
  );
}

export default ConnectShopify;
