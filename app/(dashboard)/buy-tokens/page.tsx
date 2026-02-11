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
import { Slider } from "@/components/ui/slider";
import Typography from "@/components/ui/typography";
import { authClient } from "@/lib/auth-client";
import { post } from "@/lib/fetch";
import {
  CUSTOM_AMOUNT_MAX,
  CUSTOM_AMOUNT_MIN,
  getCustomAmountPriceEur,
  TOKEN_COST_EMAIL,
  TOKEN_COST_SMS,
  TOKEN_COST_WHATSAPP,
} from "@/lib/token-packs";
import { useMutation } from "@tanstack/react-query";
import { Coins, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type CreateCheckoutSessionResponse = { url?: string; error?: string };

/** Preset amounts (tokens) for quick selection. */
const AMOUNT_PRESETS = [250, 500, 1000, 2500, 5000, 7500, 10000] as const;

export default function BuyTokensPage() {
  const { data: session } = authClient.useSession();
  const searchParams = useSearchParams();
  const [customAmount, setCustomAmount] = useState(100);

  const balance =
    typeof (session?.user as { tokenBalance?: number } | undefined)
      ?.tokenBalance === "number"
      ? (session?.user as { tokenBalance: number }).tokenBalance
      : 0;

  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");
    const tokensParam = searchParams.get("tokens");
    if (success === "1") {
      const count = tokensParam ? parseInt(tokensParam, 10) : NaN;
      const message = Number.isFinite(count) && count > 0
        ? `${count.toLocaleString()} token${count === 1 ? "" : "s"} added to your balance.`
        : "Tokens added to your account.";
      toast.success(message);
      window.history.replaceState({}, "", "/buy-tokens");
    }
    if (canceled === "1") {
      toast.info("Checkout canceled.");
      window.history.replaceState({}, "", "/buy-tokens");
    }
  }, [searchParams]);

  const createCheckoutMutation = useMutation({
    mutationFn: async (amount: number) => {
      const res = await post("tokens/create-checkout-session", { amount });
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

  const handleBuy = () => {
    createCheckoutMutation.mutate(customAmount);
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

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Choose your amount</CardTitle>
          <CardDescription>
            Select any number of tokens between {CUSTOM_AMOUNT_MIN} and{" "}
            {CUSTOM_AMOUNT_MAX.toLocaleString()}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="font-medium tabular-nums">
                {customAmount.toLocaleString()} tokens
              </span>
              <span className="text-muted-foreground tabular-nums">
                {getCustomAmountPriceEur(customAmount).toFixed(2)} €
              </span>
            </div>
            <Slider
              min={CUSTOM_AMOUNT_MIN}
              max={CUSTOM_AMOUNT_MAX}
              step={10}
              value={[customAmount]}
              onValueChange={([v]) => setCustomAmount(v ?? CUSTOM_AMOUNT_MIN)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {AMOUNT_PRESETS.map((amount) => (
              <Button
                key={amount}
                variant={customAmount === amount ? "default" : "outline"}
                size="sm"
                onClick={() => setCustomAmount(amount)}

              >
                {amount.toLocaleString()}
              </Button>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full hover:scale-none"
            onClick={handleBuy}
            disabled={createCheckoutMutation.isPending}

          >
            {createCheckoutMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Redirecting...
              </>
            ) : (
              `Buy ${customAmount.toLocaleString()} tokens`
            )}
          </Button>
        </CardFooter>
      </Card>

      <Typography variant="description" className="text-sm text-muted-foreground block">
        Cost per message: {TOKEN_COST_EMAIL} token (email), {TOKEN_COST_SMS} (SMS), {TOKEN_COST_WHATSAPP} (WhatsApp).
        If your balance is too low when a message is due, the campaign is automatically paused.
      </Typography>
    </div>
  );
}
