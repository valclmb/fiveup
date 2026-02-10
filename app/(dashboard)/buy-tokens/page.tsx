"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Typography from "@/components/ui/typography";
import { authClient } from "@/lib/auth-client";
import { post } from "@/lib/fetch";
import {
  TOKEN_COST_EMAIL,
  TOKEN_COST_SMS,
  TOKEN_COST_WHATSAPP,
  TOKEN_PACKS,
} from "@/lib/token-packs";
import { useMutation } from "@tanstack/react-query";
import { Coins, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

type CreateCheckoutSessionResponse = { url?: string; error?: string };

export default function BuyTokensPage() {
  const { data: session } = authClient.useSession();
  const searchParams = useSearchParams();

  const balance =
    typeof (session?.user as { tokenBalance?: number } | undefined)
      ?.tokenBalance === "number"
      ? (session?.user as { tokenBalance: number }).tokenBalance
      : 0;

  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");
    if (success === "1") {
      toast.success("Tokens added to your account.");
      window.history.replaceState({}, "", "/buy-tokens");
    }
    if (canceled === "1") {
      toast.info("Checkout canceled.");
      window.history.replaceState({}, "", "/buy-tokens");
    }
  }, [searchParams]);

  const createCheckoutMutation = useMutation({
    mutationFn: async (packId: string) => {
      const res = await post("tokens/create-checkout-session", { packId });
      return res as CreateCheckoutSessionResponse;
    },
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error("No checkout URL returned");
      }
    },
  });

  const handleBuy = (packId: string) => {
    createCheckoutMutation.mutate(packId);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <Coins className="size-6 text-primary" />
        </div>
        <div>
          <Typography variant="h1" className="text-2xl md:text-3xl font-bold">
            Buy tokens
          </Typography>
          <Typography variant="description" className="text-muted-foreground">
            Use tokens to send review requests by SMS, email, or WhatsApp.
          </Typography>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current balance</CardTitle>
          <CardDescription>
            Tokens are deducted only after a message is successfully sent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Typography variant="h1" className="text-3xl font-bold tabular-nums">
            {balance} <span className="text-muted-foreground font-normal text-lg">tokens</span>
          </Typography>
        </CardContent>
      </Card>

      <div>
        <Typography variant="h2" className="text-xl font-semibold mb-4">
          Token packs
        </Typography>
        <div className="grid gap-4 sm:grid-cols-2">
          {TOKEN_PACKS.map((pack) => (
            <Card key={pack.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <p className="text-2xl font-bold mt-2">
                  {pack.priceEur} €
                </p>
                <CardTitle className="text-lg">{pack.label}</CardTitle>
                <CardDescription>
                  One-time purchase — tokens never expire.
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto pt-4">
                <Button
                  className="w-full"
                  onClick={() => handleBuy(pack.id)}
                  disabled={createCheckoutMutation.isPending}
                >
                  {createCheckoutMutation.isPending &&
                    createCheckoutMutation.variables === pack.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Redirecting...
                    </>
                  ) : (
                    "Buy tokens"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <Typography variant="description" className="text-sm text-muted-foreground block">
        Cost per message: {TOKEN_COST_EMAIL} token (email), {TOKEN_COST_SMS} (SMS), {TOKEN_COST_WHATSAPP} (WhatsApp).
        If your balance is too low when a message is due, the campaign is automatically paused.
      </Typography>
    </div>
  );
}
