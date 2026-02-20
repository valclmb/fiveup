"use client";

import { getAll } from "@/lib/fetch";
import { TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Typography from "@/components/ui/typography";
import { useQuery } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import {
  Coins,
  CreditCard,
  Gift,
  Mail,
  MessageCircle,
  MessageSquare,
  Sparkles,
} from "lucide-react";

type TokenTransactionRow = {
  id: string;
  amount: number;
  reason: string;
  metadata: unknown;
  createdAt: string;
};

type Response = { transactions: TokenTransactionRow[] };

const REASON_CONFIG: Record<
  string,
  { label: string; icon: LucideIcon }
> = {
  signup_bonus: { label: "Signup bonus", icon: Gift },
  plan_upgrade: { label: "Plan bonus", icon: Sparkles },
  plan_bonus: { label: "Plan bonus", icon: Sparkles },
  purchase: { label: "Purchase", icon: CreditCard },
  consumed_sms: { label: "SMS", icon: MessageSquare },
  consumed_email: { label: "Email", icon: Mail },
  consumed_whatsapp: { label: "WhatsApp", icon: MessageCircle },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TabsTokenTransactions() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["profile", "token-transactions"],
    queryFn: () => getAll<Response>("profile/token-transactions"),
  });

  const transactions = data?.transactions ?? [];

  return (
    <TabsContent value="tokens">
      <Typography variant="h3" className="mb-4">
        Token history
      </Typography>
      <p className="text-sm text-muted-foreground mb-4">
        Credits and debits on your token balance.
      </p>
      {isLoading ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3].map((i) => (
                <TableRow key={i}>
                  <TableCell className="animate-pulse bg-muted/50 h-8 rounded" />
                  <TableCell className="animate-pulse bg-muted/50 h-8 rounded" />
                  <TableCell className="animate-pulse bg-muted/50 h-8 rounded" />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : error ? (
        <Typography variant="description" className="text-destructive">
          Failed to load transactions.
        </Typography>
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-12 text-center">
          <Coins className="size-10 text-muted-foreground" />
          <Typography variant="p" className="text-muted-foreground">
            No token transactions yet.
          </Typography>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(t.createdAt)}
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const config = REASON_CONFIG[t.reason];
                      const Icon = config?.icon;
                      const label = config?.label ?? t.reason;
                      return Icon ? (
                        <span className="flex items-center gap-2">
                          <Icon className="size-4 text-muted-foreground shrink-0" />
                          {label}
                        </span>
                      ) : (
                        label
                      );
                    })()}
                  </TableCell>
                  <TableCell
                    className={`text-right tabular-nums font-medium ${
                      t.amount >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {t.amount >= 0 ? "+" : ""}
                    {t.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </TabsContent>
  );
}
