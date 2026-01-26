"use client";

import {
  AlertDialog, AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Typography from "@/components/ui/typography";
import { getAll, post } from "@/lib/fetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MinusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export function ConnectShopify() {
  const queryClient = useQueryClient();


  const { data: store, isLoading } = useQuery({
    queryKey: ["shopify-stores"],
    queryFn: () => getAll("/shopify/stores"),
    select: (data) => data.stores[0],
  })



  const disconnect = useMutation({
    mutationFn: (storeId: string) => {
      toast.loading("Disconnecting Shopify store...");
      return post("/shopify/disconnect", { storeId });
    },
    onSuccess: (res) => {
      toast.dismiss();
      toast.success("Shopify store disconnected successfully");
      queryClient.invalidateQueries({ queryKey: ["shopify-stores"] });
    }
  })


  return (<div className="flex items-center gap-2 group">
    <Item variant="outline" className="max-w-max  bg-background z-20">
      <ItemMedia variant="icon">
        <Image src="/images/shopify-logo.svg" alt="Shopify" width={110} height={24} />
      </ItemMedia>

      <ConnectShopifyContent store={store} isLoading={isLoading} />

    </Item>
    {store && <TooltipProvider>
      <Tooltip>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="-translate-x-10 group-hover:translate-x-0"><MinusCircle className="text-destructive" /></Button>
            </TooltipTrigger>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Five up will be disconnected from your store.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={() => disconnect.mutate(store?.id)}>Yes, disconnect</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <TooltipContent>
          Supprimer la connexion
        </TooltipContent>
      </Tooltip>

    </TooltipProvider>}


  </div >

  )
};

export default ConnectShopify;

interface ConnectShopifyContentProps {
  store: any;
  isLoading: boolean;
}

const ConnectShopifyContent = ({ store, isLoading }: ConnectShopifyContentProps) => {
  const [shop, setShop] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);



  const handleConnect = () => {
    if (isConnecting) return;



    if (!shop.trim()) {
      toast.error("Please enter your shop name");

      return;
    }

    const shopName = shop.replace(".myshopify.com", "").trim();

    if (!/^[a-zA-Z0-9-]+$/.test(shopName)) {
      toast.error("Invalid shop name. Use only letters, numbers and hyphens.");

      return;
    }

    setIsConnecting(true);
    window.location.href = `/api/shopify/auth?shop=${encodeURIComponent(shopName)}`;
  };

  if (isLoading) return <div className="flex gap-2">
    <Skeleton className="min-w-96 h-10" />
    <Skeleton className="w-20 h-10" />
  </div>

  if (!store) {
    return (<>
      <ItemContent >
        <Field>
          <InputGroup>
            <InputGroupInput placeholder="myshop" value={shop} onChange={(e) => setShop(e.target.value)} />
            <InputGroupAddon align="inline-end">
              <InputGroupText>.myshopify.com</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </ItemContent>
      <ItemActions >
        <Button onClick={handleConnect}>
          {isConnecting ? <Spinner /> : 'Connecter'}
        </Button>
      </ItemActions>
    </>
    )
  }

  return (
    <>
      <ItemContent >
        <Typography variant="p" className="font-bold">
          <Link href={`https://${store?.shop}`} target="_blank" className="hover:underline">{store?.shop}</Link></Typography>
      </ItemContent>
      <ItemActions>
        <Badge variant="outline"><div className="size-2 bg-primary rounded-full" /> Connected</Badge>
      </ItemActions >

    </>
  )

}
