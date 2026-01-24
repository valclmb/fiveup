"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useCallback, useEffect, useState } from "react";

interface ShopifyStore {
  id: string;
  shop: string;
  scope: string;
  createdAt: string;
  updatedAt: string;
}

interface ShopifyIntegrationCardProps {
  className?: string;
}

/**
 * Card qui affiche automatiquement la boutique Shopify connectée
 * ou le formulaire de connexion si aucune boutique n'est connectée
 */
export function ShopifyIntegrationCard({ className = "" }: ShopifyIntegrationCardProps) {
  const [stores, setStores] = useState<ShopifyStore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [error, setError] = useState("");

  // État pour le formulaire de connexion
  const [shop, setShop] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectError, setConnectError] = useState("");

  const fetchStores = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/shopify/stores");
      if (!response.ok) throw new Error("Failed to fetch stores");
      const data = await response.json();
      setStores(data.stores || []);
    } catch (err) {
      console.error("Error fetching Shopify stores:", err);
      setError("Failed to load Shopify stores");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleDisconnect = async (storeId: string) => {
    try {
      setIsDisconnecting(true);
      const response = await fetch("/api/shopify/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId }),
      });

      if (!response.ok) throw new Error("Failed to disconnect");

      await fetchStores();
    } catch (err) {
      console.error("Error disconnecting store:", err);
      setError("Failed to disconnect store");
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleConnect = () => {
    setConnectError("");

    if (!shop.trim()) {
      setConnectError("Please enter your shop name");
      return;
    }

    const shopName = shop.replace(".myshopify.com", "").trim();
    if (!/^[a-zA-Z0-9-]+$/.test(shopName)) {
      setConnectError("Invalid shop name. Use only letters, numbers and hyphens.");
      return;
    }

    setIsConnecting(true);
    window.location.href = `/api/shopify/auth?shop=${encodeURIComponent(shopName)}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleConnect();
    }
  };

  const connectedStore = stores[0];

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#96bf48] rounded-lg">
            <ShopifyLogo />
          </div>
          <div>
            <CardTitle>Shopify</CardTitle>
            <CardDescription>
              {connectedStore
                ? "Your Shopify store is connected"
                : "Connect your Shopify store to import orders"
              }
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Spinner />
          </div>
        ) : connectedStore ? (
          // Boutique connectée
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">{connectedStore.shop}</p>
                <p className="text-sm text-muted-foreground">
                  Connected {new Date(connectedStore.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-1 rounded-full">
                Connected
              </span>
            </div>

            <Button
              variant="outline"
              onClick={() => handleDisconnect(connectedStore.id)}
              disabled={isDisconnecting}
              className="w-full text-destructive hover:text-destructive"
            >
              {isDisconnecting ? (
                <>
                  <Spinner className="mr-2" />
                  Disconnecting...
                </>
              ) : (
                "Disconnect Store"
              )}
            </Button>
          </div>
        ) : (
          // Formulaire de connexion
          <div className="space-y-4">
            <div className="flex gap-2 items-center">
              <Input
                placeholder="my-store"
                value={shop}
                onChange={(e) => setShop(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isConnecting}
                className="flex-1"
              />
              <span className="text-muted-foreground text-sm whitespace-nowrap">
                .myshopify.com
              </span>
            </div>

            {(connectError || error) && (
              <p className="text-sm text-destructive">{connectError || error}</p>
            )}

            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? (
                <>
                  <Spinner className="mr-2" />
                  Connecting...
                </>
              ) : (
                "Connect Store"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Composant pour connexion manuelle (Custom Apps)
 * L'utilisateur entre le nom de la boutique et l'access token
 */
interface ShopifyManualConnectProps {
  className?: string;
  installUrl?: string;
  onSuccess?: () => void;
}

export function ShopifyManualConnect({ className = "", installUrl, onSuccess }: ShopifyManualConnectProps) {
  const [shop, setShop] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleConnect = async () => {
    setError("");

    if (!shop.trim() || !accessToken.trim()) {
      setError("Shop name and access token are required");
      return;
    }

    setIsConnecting(true);

    try {
      const response = await fetch("/api/shopify/manual-connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop, accessToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Connection failed");
      }

      setSuccess(true);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed");
    } finally {
      setIsConnecting(false);
    }
  };

  if (success) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="text-green-500 text-4xl">✓</div>
            <p className="font-medium">Store connected successfully!</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Refresh page
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#96bf48] rounded-lg">
            <ShopifyLogo />
          </div>
          <div>
            <CardTitle>Connect Shopify (Custom App)</CardTitle>
            <CardDescription>
              Enter your store details after installing the app
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {installUrl && (
          <div className="p-3 bg-muted rounded-lg text-sm">
            <p className="font-medium mb-2">Step 1: Install the app</p>
            <Button asChild variant="outline" size="sm">
              <a href={installUrl} target="_blank" rel="noopener noreferrer">
                Open Shopify Install Page →
              </a>
            </Button>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm font-medium">
            {installUrl ? "Step 2: Enter your credentials" : "Enter your credentials"}
          </p>

          <div className="flex gap-2 items-center">
            <Input
              placeholder="my-store"
              value={shop}
              onChange={(e) => setShop(e.target.value)}
              disabled={isConnecting}
              className="flex-1"
            />
            <span className="text-muted-foreground text-sm whitespace-nowrap">
              .myshopify.com
            </span>
          </div>

          <Input
            type="password"
            placeholder="Access Token (shpat_...)"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            disabled={isConnecting}
          />

          <p className="text-xs text-muted-foreground">
            After installing, Shopify will show you the access token. Copy and paste it here.
          </p>
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <Button
          onClick={handleConnect}
          disabled={isConnecting || !shop || !accessToken}
          className="w-full"
        >
          {isConnecting ? (
            <>
              <Spinner className="mr-2" />
              Connecting...
            </>
          ) : (
            "Connect Store"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

function ShopifyLogo() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 109 124"
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M95.8 28.3c-.1-.6-.6-1-1.1-1-.5 0-10.2-.8-10.2-.8s-8.1-7.9-9-8.8c-.8-.8-2.4-.6-3-.4-.1 0-1.6.5-4.3 1.3-2.5-7.3-7-14-14.8-14h-.7C50.3 2.1 47.6.5 45.4.5c-18.3 0-27.1 22.9-29.9 34.5-7.2 2.2-12.3 3.8-12.9 4-4 1.3-4.1 1.4-4.6 5.1-.4 2.8-10.8 83.5-10.8 83.5L74.1 141l46.7-10.1S96 28.9 95.8 28.3zM67.3 21.3l-7.1 2.2c0-1.5-.1-3.3-.4-5.3 3.2.4 5.5 1.4 7.5 3.1zm-11.8-5.6c.4 3.8.4 9.2-.6 13.6l-14.8 4.6c2.9-10.9 8.3-16.3 15.4-18.2zm-5.7-7.5c1 0 2 .3 2.9 1-7.3 3.4-15.1 12-18.4 29.2l-11.7 3.6C26.1 29.7 34.3 8.2 49.8 8.2z" />
    </svg>
  );
}

// Export par défaut pour utilisation simple
export default ShopifyIntegrationCard;
