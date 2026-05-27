import { createActor } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdmin } from "@/hooks/useAdmin";
import { getTierInfo } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Clock, Copy, LogOut, TrendingUp, Users, Wallet } from "lucide-react";
import { toast } from "sonner";

export function AdminPage() {
  const { logout } = useAdmin();
  const { actor, isFetching: actorLoading } = useActor(createActor);

  const registrationsQuery = useQuery({
    queryKey: ["registrations"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).listRegistrations("Mmandk280315$");
    },
    enabled: !!actor && !actorLoading,
  });

  const countsQuery = useQuery({
    queryKey: ["tierCounts"],
    queryFn: async () => {
      if (!actor) return { tier1: 0n, tier2: 0n, tier3: 0n };
      return (actor as any).getTierCounts("Mmandk280315$");
    },
    enabled: !!actor && !actorLoading,
  });

  const registrations = registrationsQuery.data ?? [];
  const counts = countsQuery.data ?? { tier1: 0n, tier2: 0n, tier3: 0n };
  const isLoading = registrationsQuery.isLoading || countsQuery.isLoading;

  const sortedRegistrations = [...registrations].sort(
    (a, b) => Number(b.timestamp) - Number(a.timestamp),
  );

  const handleCopy = () => {
    const lines = sortedRegistrations.map((r) => {
      const info = getTierInfo(Number(r.tier));
      const dt = new Date(Number(r.timestamp) / 1_000_000).toLocaleString();
      return `${r.walletAddress} | ${info?.name ?? "Unknown"} | ${info?.usdValue ?? 0} | ${dt}`;
    });
    const text = lines.join("\n");
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied to clipboard");
    });
  };

  const totalValue =
    Number(counts.tier1) * 500 +
    Number(counts.tier2) * 150 +
    Number(counts.tier3) * 25;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Phantom Lattice Admin
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage airdrop registrations
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          data-ocid="admin.logout_button"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <Card className="glow-accent bg-card border-primary/30">
          <CardContent className="py-4 flex items-center gap-3">
            <Users className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-xl font-bold text-foreground">
                {isLoading ? (
                  <Skeleton className="h-6 w-10" />
                ) : (
                  sortedRegistrations.length
                )}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="glow-accent bg-card border-primary/30">
          <CardContent className="py-4 flex items-center gap-3">
            <Wallet className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Tier 1</p>
              <p className="text-xl font-bold text-foreground">
                {isLoading ? (
                  <Skeleton className="h-6 w-10" />
                ) : (
                  Number(counts.tier1)
                )}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="glow-accent bg-card border-primary/30">
          <CardContent className="py-4 flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Tier 2</p>
              <p className="text-xl font-bold text-foreground">
                {isLoading ? (
                  <Skeleton className="h-6 w-10" />
                ) : (
                  Number(counts.tier2)
                )}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="glow-accent bg-card border-primary/30">
          <CardContent className="py-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Tier 3</p>
              <p className="text-xl font-bold text-foreground">
                {isLoading ? (
                  <Skeleton className="h-6 w-10" />
                ) : (
                  Number(counts.tier3)
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6 bg-primary/5 border-primary/20">
        <CardContent className="py-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total USD Value</p>
            <p className="text-2xl font-bold text-primary">
              ${totalValue.toLocaleString()} USD
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={registrations.length === 0}
            data-ocid="admin.copy_clipboard_button"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy to Clipboard
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Paid Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : sortedRegistrations.length === 0 ? (
            <div
              className="text-center py-12 text-muted-foreground"
              data-ocid="admin.registrations.empty_state"
            >
              <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No registrations yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-2 px-3 font-medium">#</th>
                    <th className="text-left py-2 px-3 font-medium">
                      Wallet Address
                    </th>
                    <th className="text-left py-2 px-3 font-medium">
                      Tier Name
                    </th>
                    <th className="text-left py-2 px-3 font-medium">
                      USD Value
                    </th>
                    <th className="text-left py-2 px-3 font-medium">
                      Submitted At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRegistrations.map((r, i) => {
                    const info = getTierInfo(Number(r.tier));
                    return (
                      <tr
                        key={`${r.walletAddress}-${i}`}
                        className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                        data-ocid={`admin.registrations.item.${i + 1}`}
                      >
                        <td className="py-2.5 px-3 text-muted-foreground">
                          {i + 1}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-xs max-w-[200px] truncate">
                          {r.walletAddress}
                        </td>
                        <td className="py-2.5 px-3">
                          <Badge variant="secondary" className="text-xs">
                            {info?.name ?? "Unknown"}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 font-medium text-primary">
                          ${info?.usdValue ?? 0} USD
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground text-xs">
                          {new Date(
                            Number(r.timestamp) / 1_000_000,
                          ).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <FreeRaffleAdminSection />
    </div>
  );
}

function FreeRaffleAdminSection() {
  const { actor, isFetching: actorLoading } = useActor(createActor);

  const raffleQuery = useQuery({
    queryKey: ["raffleEntries"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).listRaffleEntries("Mmandk280315$") as Promise<
        Array<{
          walletAddress: string;
          entryCount: bigint;
          lastClickAt: bigint;
          registeredAt: bigint;
        }>
      >;
    },
    enabled: !!actor && !actorLoading,
  });

  const entries = raffleQuery.data ?? [];
  const isLoading = raffleQuery.isLoading;

  const sortedEntries = [...entries].sort(
    (a, b) => Number(b.registeredAt) - Number(a.registeredAt),
  );

  const handleCopyRaffle = () => {
    const lines = sortedEntries.map((e) => {
      const lastClick = new Date(
        Number(e.lastClickAt) / 1_000_000,
      ).toLocaleString();
      const registered = new Date(
        Number(e.registeredAt) / 1_000_000,
      ).toLocaleString();
      return `${e.walletAddress} | ${e.entryCount} | ${lastClick} | ${registered}`;
    });
    const text = lines.join("\n");
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied free raffle data to clipboard");
    });
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Free Raffle Registrations</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyRaffle}
            disabled={entries.length === 0}
            data-ocid="admin.raffle.copy_clipboard_button"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy to Clipboard
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Total:{" "}
          {isLoading ? (
            <Skeleton className="h-4 w-8 inline-block" />
          ) : (
            entries.length
          )}
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : sortedEntries.length === 0 ? (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="admin.raffle.empty_state"
          >
            <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No free raffle entries yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left py-2 px-3 font-medium">#</th>
                  <th className="text-left py-2 px-3 font-medium">
                    Wallet Address
                  </th>
                  <th className="text-left py-2 px-3 font-medium">Entries</th>
                  <th className="text-left py-2 px-3 font-medium">
                    Last Claim
                  </th>
                  <th className="text-left py-2 px-3 font-medium">
                    Registered
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedEntries.map((e, i) => (
                  <tr
                    key={`${e.walletAddress}-${i}`}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                    data-ocid={`admin.raffle.item.${i + 1}`}
                  >
                    <td className="py-2.5 px-3 text-muted-foreground">
                      {i + 1}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-xs max-w-[200px] truncate">
                      {e.walletAddress}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-primary">
                      {Number(e.entryCount)}
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground text-xs">
                      {new Date(
                        Number(e.lastClickAt) / 1_000_000,
                      ).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground text-xs">
                      {new Date(
                        Number(e.registeredAt) / 1_000_000,
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
