import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useRaffleClaim,
  useRaffleRegister,
  useRaffleStatus,
} from "@/hooks/useRaffle";
import { AlertCircle, CheckCircle, Gift, Timer, Wallet } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const COOLDOWN_MS = 24 * 60 * 60 * 1000;

function formatCountdown(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}

export function FreeRaffleSection() {
  const [walletAddress, setWalletAddress] = useState("");
  const [registeredWallet, setRegisteredWallet] = useState<string | null>(null);

  const register = useRaffleRegister();
  const claim = useRaffleClaim();

  const activeWallet = registeredWallet ?? walletAddress;
  const statusQuery = useRaffleStatus(activeWallet);
  const status = statusQuery.data;

  const isValidWallet = (addr: string) =>
    /^0x[a-fA-F0-9]{40}$/.test(addr.trim());

  const handleRegister = async () => {
    if (!isValidWallet(walletAddress)) return;
    try {
      await register.mutateAsync(walletAddress.trim());
      setRegisteredWallet(walletAddress.trim());
      toast.success("Registered for the free raffle!");
    } catch (err) {
      if (err instanceof Error && err.message.includes("already registered")) {
        setRegisteredWallet(walletAddress.trim());
        toast.info("This wallet is already registered");
      } else {
        toast.error("Registration failed", {
          description: err instanceof Error ? err.message : "Please try again.",
        });
      }
    }
  };

  const handleClaim = async () => {
    if (!registeredWallet) return;
    try {
      await claim.mutateAsync(registeredWallet);
      toast.success("Daily entry claimed!");
    } catch (err) {
      toast.error("Claim failed", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    }
  };

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const cooldownRemaining = useMemo(() => {
    if (status?.__kind__ !== "ok") return 0;
    const lastClickMs = Number(status.ok.lastClickAt) / 1_000_000;
    const elapsed = now - lastClickMs;
    return Math.max(0, COOLDOWN_MS - elapsed);
  }, [status, now]);

  const isOnCooldown = cooldownRemaining > 0;

  const entryCount =
    status?.__kind__ === "ok" ? Number(status.ok.entryCount) : 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-2">
          Free Raffle Entry
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto text-sm">
          Enter for a chance to join the lattice for free. Register your wallet
          and come back every 24 hours to earn additional entries.
        </p>
      </div>

      {!registeredWallet && (
        <Card className="border-border glow-accent-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Gift className="w-5 h-5 text-primary" />
              Register for Free Raffle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label
                htmlFor="raffle-wallet"
                className="text-sm text-muted-foreground mb-1.5 block"
              >
                Polygon Wallet Address
              </Label>
              <Input
                id="raffle-wallet"
                placeholder="0x..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="font-mono bg-input border-border focus:ring-primary"
                data-ocid="raffle.wallet_input"
              />
              {walletAddress && !isValidWallet(walletAddress) && (
                <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Please enter a valid 0x address (42 characters)
                </p>
              )}
            </div>
            <Button
              type="button"
              size="lg"
              className="w-full glow-accent-hover"
              disabled={!isValidWallet(walletAddress) || register.isPending}
              onClick={handleRegister}
              data-ocid="raffle.register_button"
            >
              {register.isPending ? "Registering…" : "Register Wallet"}
            </Button>
          </CardContent>
        </Card>
      )}

      {registeredWallet && (
        <Card className="border-border glow-accent-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Wallet className="w-5 h-5 text-primary" />
              Your Raffle Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Wallet Address
              </span>
              <span className="font-mono text-sm text-foreground break-all">
                {registeredWallet}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 rounded-lg bg-primary/10 border border-primary/20 p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Total Entries
                </p>
                <p className="text-3xl font-bold text-primary">{entryCount}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                type="button"
                size="lg"
                className="w-full glow-accent-hover"
                disabled={claim.isPending || isOnCooldown}
                onClick={handleClaim}
                data-ocid="raffle.claim_button"
              >
                {claim.isPending ? (
                  "Claiming…"
                ) : isOnCooldown ? (
                  <span className="flex items-center gap-2">
                    <Timer className="w-4 h-4" />
                    Next claim in {formatCountdown(cooldownRemaining)}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Claim Daily Entry
                  </span>
                )}
              </Button>
              {isOnCooldown && (
                <p className="text-xs text-muted-foreground text-center">
                  You can claim again once the timer reaches zero.
                </p>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                setRegisteredWallet(null);
                setWalletAddress("");
              }}
              data-ocid="raffle.reset_button"
            >
              Use Different Wallet
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
