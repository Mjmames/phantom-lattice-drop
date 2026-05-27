import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyPurchases } from "@/hooks/useMyPurchases";
import { useFreeRaffleEntries, useRaffleStatus } from "@/hooks/useRaffle";
import { getTierInfo } from "@/types";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Gift,
  LogIn,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const DRAW_DATE = new Date("2027-01-21T00:00:00Z");
const COOLDOWN_MS = 24 * 60 * 60 * 1000;

export function DashboardPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

  const [walletInput, setWalletInput] = useState("");
  const [activeWallet, setActiveWallet] = useState("");
  const [now, setNow] = useState(Date.now());

  const { data: myPurchases = [], isLoading: purchasesLoading } =
    useMyPurchases();
  const { data: raffleStatus, isLoading: raffleLoading } =
    useRaffleStatus(activeWallet);
  const { data: raffleEntries = [], isLoading: entriesLoading } =
    useFreeRaffleEntries();

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!identity) {
      navigate("/register", { replace: true });
    }
  }, [identity, navigate]);

  const isValidWallet = (addr: string) =>
    /^0x[a-fA-F0-9]{40}$/.test(addr.trim());

  const handleCheckWallet = () => {
    if (isValidWallet(walletInput)) setActiveWallet(walletInput.trim());
  };

  const drawDiff = DRAW_DATE.getTime() - now;
  const drawCountdown =
    drawDiff > 0
      ? (() => {
          const d = Math.floor(drawDiff / 86400000);
          const h = Math.floor((drawDiff % 86400000) / 3600000);
          const m = Math.floor((drawDiff % 3600000) / 60000);
          const s = Math.floor((drawDiff % 60000) / 1000);
          return `${d}d ${h}h ${m}m ${s}s`;
        })()
      : "Draw has occurred";

  const entryCount =
    raffleStatus?.__kind__ === "ok" ? Number(raffleStatus.ok.entryCount) : 0;
  const isRegistered = raffleStatus?.__kind__ === "ok";

  const cooldownRemaining = useMemo(() => {
    if (raffleStatus?.__kind__ !== "ok") return 0;
    const lastMs = Number(raffleStatus.ok.lastClickAt) / 1_000_000;
    return Math.max(0, COOLDOWN_MS - (now - lastMs));
  }, [raffleStatus, now]);

  const cooldownText =
    cooldownRemaining > 0
      ? (() => {
          const h = Math.floor(cooldownRemaining / 3600000);
          const m = Math.floor((cooldownRemaining % 3600000) / 60000);
          const s = Math.floor((cooldownRemaining % 60000) / 1000);
          return `${h}h ${m}m ${s}s`;
        })()
      : "Ready to claim";

  const top3 = useMemo(
    () =>
      [...raffleEntries]
        .sort((a, b) => Number(b.entryCount) - Number(a.entryCount))
        .slice(0, 3),
    [raffleEntries],
  );

  const medals = ["🥇", "🥈", "🥉"];

  if (!identity) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <div className="text-center space-y-4">
          <LogIn className="w-10 h-10 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">
            Sign in to view your dashboard
          </p>
          <Button asChild data-ocid="dashboard.login_button">
            <Link to="/register">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-card border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-8 sm:py-10">
          <Link
            to="/choose"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary text-sm transition-colors mb-5"
            data-ocid="dashboard.back_link"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to choices
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                My Dashboard
              </h1>
              <p className="text-muted-foreground text-sm">
                Phantom Lattice · Status Overview
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-background py-8 sm:py-10">
        <div className="max-w-3xl mx-auto px-4 space-y-8">
          {/* Draw Countdown */}
          <div
            className="p-5 rounded-xl bg-card border border-primary/20 flex items-center gap-4"
            data-ocid="dashboard.draw_countdown"
          >
            <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Draw Date
              </p>
              <p className="font-display text-foreground font-semibold">
                January 21, 2027
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-display text-xl font-bold text-primary font-mono">
                {drawCountdown}
              </p>
            </div>
          </div>

          {/* Verified Tiers */}
          <div
            className="rounded-xl bg-card border border-border overflow-hidden"
            data-ocid="dashboard.tiers_section"
          >
            <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <h2 className="font-display text-base font-semibold text-foreground">
                Your Verified Tiers
              </h2>
            </div>
            <div className="p-5">
              {purchasesLoading ? (
                <div
                  className="space-y-3"
                  data-ocid="dashboard.tiers_loading_state"
                >
                  <Skeleton className="h-14 rounded-lg" />
                  <Skeleton className="h-14 rounded-lg" />
                </div>
              ) : myPurchases.length === 0 ? (
                <div
                  className="text-center py-6 space-y-3"
                  data-ocid="dashboard.tiers_empty_state"
                >
                  <p className="text-muted-foreground text-sm">
                    No tiers purchased yet.
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="glow-accent-hover"
                    data-ocid="dashboard.tiers_buy_link"
                  >
                    <Link to="/tiers">Browse available tiers →</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3" data-ocid="dashboard.tiers_list">
                  {myPurchases.map((tier, i) => {
                    const info = getTierInfo(tier);
                    if (!info) return null;
                    return (
                      <div
                        key={tier}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-primary/20"
                        data-ocid={`dashboard.tier_card.${i + 1}`}
                      >
                        <div className="w-9 h-9 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          <CheckCircle className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">
                            Tier {tier} — {info.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {info.description}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="text-primary font-bold text-sm">
                            ${info.usdValue}
                          </span>
                          <Badge className="text-xs bg-primary/15 text-primary border-primary/20 gap-1">
                            <CheckCircle className="w-3 h-3" /> Verified
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Raffle Status */}
          <div
            className="rounded-xl bg-card border border-border overflow-hidden"
            data-ocid="dashboard.raffle_section"
          >
            <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
              <Gift className="w-4 h-4 text-primary" />
              <h2 className="font-display text-base font-semibold text-foreground">
                Your Raffle Status
              </h2>
            </div>
            <div className="p-5 space-y-4">
              {!activeWallet ? (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Enter your raffle wallet address to check your status.
                  </p>
                  <div>
                    <Label
                      htmlFor="dash-wallet"
                      className="text-xs text-muted-foreground mb-1 block"
                    >
                      Polygon Wallet Address
                    </Label>
                    <Input
                      id="dash-wallet"
                      placeholder="0x..."
                      value={walletInput}
                      onChange={(e) => setWalletInput(e.target.value)}
                      className="font-mono text-sm bg-input border-border"
                      data-ocid="dashboard.wallet_input"
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    className="w-full glow-accent-hover"
                    disabled={!isValidWallet(walletInput)}
                    onClick={handleCheckWallet}
                    data-ocid="dashboard.wallet_check_button"
                  >
                    Check Status
                  </Button>
                </div>
              ) : raffleLoading ? (
                <Skeleton
                  className="h-28 rounded-lg"
                  data-ocid="dashboard.raffle_loading_state"
                />
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className="rounded-lg bg-primary/8 border border-primary/20 p-4 text-center"
                      data-ocid="dashboard.raffle_entries_card"
                    >
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Your Entries
                      </p>
                      <p className="text-3xl font-bold text-primary">
                        {isRegistered ? entryCount : "—"}
                      </p>
                    </div>
                    <div
                      className="rounded-lg bg-card border border-border p-4 text-center"
                      data-ocid="dashboard.raffle_cooldown_card"
                    >
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Next Claim
                      </p>
                      <p className="text-sm font-semibold text-foreground font-mono">
                        {isRegistered ? cooldownText : "Not registered"}
                      </p>
                    </div>
                  </div>

                  {!isRegistered && (
                    <div
                      className="rounded-lg border border-border bg-muted/20 p-4 text-center space-y-3"
                      data-ocid="dashboard.raffle_not_registered_state"
                    >
                      <p className="text-sm text-muted-foreground">
                        This wallet is not registered for the raffle.
                      </p>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="glow-accent-hover"
                      >
                        <Link to="/register#raffle">
                          Enter the free raffle →
                        </Link>
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground text-xs"
                      onClick={() => {
                        setActiveWallet("");
                        setWalletInput("");
                      }}
                      data-ocid="dashboard.wallet_reset_button"
                    >
                      Use different wallet
                    </Button>
                    <Button
                      asChild
                      variant="link"
                      size="sm"
                      className="text-primary text-xs"
                      data-ocid="dashboard.raffle_more_entries_link"
                    >
                      <Link to="/register#raffle">Add more entries →</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Leaderboard */}
          <div
            className="rounded-xl bg-card border border-border overflow-hidden"
            data-ocid="dashboard.leaderboard_section"
          >
            <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
              <Trophy className="w-4 h-4 text-primary" />
              <h2 className="font-display text-base font-semibold text-foreground">
                Top 3 Raffle Leaders
              </h2>
            </div>
            <div className="p-5">
              {entriesLoading ? (
                <div
                  className="space-y-2"
                  data-ocid="dashboard.leaderboard_loading_state"
                >
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-14 rounded-lg" />
                  ))}
                </div>
              ) : top3.length === 0 ? (
                <div
                  className="text-center py-6"
                  data-ocid="dashboard.leaderboard_empty_state"
                >
                  <p className="text-muted-foreground text-sm">
                    No raffle entries yet. Be the first!
                  </p>
                </div>
              ) : (
                <div
                  className="space-y-2"
                  data-ocid="dashboard.leaderboard_list"
                >
                  {top3.map((entry, i) => (
                    <div
                      key={entry.walletAddress}
                      className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3 transition-all duration-200 ${i === 0 ? "border-primary/40 bg-primary/8" : "border-border bg-muted/20"}`}
                      data-ocid={`dashboard.leaderboard.item.${i + 1}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-lg shrink-0">{medals[i]}</span>
                        <span className="font-mono text-sm text-foreground truncate">
                          {entry.walletAddress.length > 14
                            ? `${entry.walletAddress.slice(0, 6)}…${entry.walletAddress.slice(-6)}`
                            : entry.walletAddress}
                        </span>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`shrink-0 font-semibold ${
                          i === 0
                            ? "bg-primary/20 text-primary border-primary/30"
                            : ""
                        }`}
                      >
                        {Number(entry.entryCount)}{" "}
                        {Number(entry.entryCount) === 1 ? "entry" : "entries"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
