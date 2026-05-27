import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { ArrowRight, Gift, ShieldCheck, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export function ChoicePage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background glow orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "oklch(0.68 0.18 290)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "oklch(0.75 0.22 260)" }}
      />

      {/* Header */}
      <div className="text-center mb-12 relative z-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="text-sm font-body tracking-widest uppercase text-primary">
            Phantom Lattice
          </span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
          Choose Your Path
        </h1>
        <p className="text-muted-foreground font-body text-lg max-w-md mx-auto">
          Enter the free raffle, become a verified ORB holder, or do both.
        </p>
      </div>

      {/* Cards */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl relative z-10"
        data-ocid="choice.card_list"
      >
        {/* Free Raffle Card */}
        <div
          className="group relative bg-card border border-border rounded-2xl p-8 flex flex-col gap-6 hover:border-primary/50 transition-all duration-300 cursor-pointer"
          data-ocid="choice.raffle_card"
          style={{
            boxShadow: "0 0 0 0 oklch(0.75 0.22 290 / 0)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow =
              "0 0 32px -8px oklch(0.75 0.22 290 / 0.35)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow =
              "0 0 0 0 oklch(0.75 0.22 290 / 0)";
          }}
        >
          <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Gift className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-2xl font-bold text-foreground mb-3">
              Enter Free Raffle
            </h2>
            <p className="text-muted-foreground font-body leading-relaxed">
              Enter for a chance to join the lattice for free. Daily check-ins
              earn extra entries — the more active you are, the higher your
              odds.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Draw date: January 21, 2027
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Daily entries via wallet check-in
            </div>
          </div>
          <Button
            className="w-full glow-accent group-hover:glow-accent-hover"
            onClick={() => navigate("/register#raffle")}
            data-ocid="choice.raffle_button"
          >
            Enter the Raffle
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        {/* Buy a Tier Card */}
        <div
          className="group relative bg-card border border-border rounded-2xl p-8 flex flex-col gap-6 hover:border-primary/50 transition-all duration-300 cursor-pointer"
          data-ocid="choice.tiers_card"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow =
              "0 0 32px -8px oklch(0.75 0.22 290 / 0.35)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow =
              "0 0 0 0 oklch(0.75 0.22 290 / 0)";
          }}
          style={{ boxShadow: "0 0 0 0 oklch(0.75 0.22 290 / 0)" }}
        >
          <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-2xl font-bold text-foreground mb-3">
              Buy a Tier
            </h2>
            <p className="text-muted-foreground font-body leading-relaxed">
              Become a verified ORB holder and secure your place in the Phantom
              Lattice network. NFTs delivered within 72 hours of purchase.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Tier 1 — $500 · Testnet Node Operator
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Tier 2 — $150 · Genesis Node Operator
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Tier 3 — $25 · Community Contributor
            </div>
          </div>
          <Button
            className="w-full glow-accent group-hover:glow-accent-hover"
            onClick={() => navigate("/tiers")}
            data-ocid="choice.tiers_button"
          >
            View All Tiers
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Both note */}
      <p
        className="mt-8 text-muted-foreground text-sm font-body text-center relative z-10"
        data-ocid="choice.both_note"
      >
        You can do both — raffle entries are free regardless of tier purchase.
      </p>

      {/* View status link — shown only if identity is present */}
      {identity && (
        <Link
          to="/dashboard"
          className="mt-4 text-primary/70 hover:text-primary text-sm font-body underline underline-offset-4 transition-colors relative z-10"
          data-ocid="choice.dashboard_link"
        >
          View your status →
        </Link>
      )}
    </div>
  );
}
