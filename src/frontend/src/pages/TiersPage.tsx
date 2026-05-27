import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { usePurchaseVerification } from "@/hooks/usePurchaseVerification";
import { TIER_CONFIG } from "@/types";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Shield,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

const TIER_DETAILS = [
  {
    icon: Zap,
    benefits: [
      "Highest ORB allocation in the airdrop pool",
      "12-month linear vesting schedule",
      "Priority access to future lattice phases",
      "Capped at 500 holders globally",
    ],
    badge: "Rarest",
    badgeVariant: "default" as const,
    glow: "shadow-[0_0_40px_oklch(0.68_0.18_290/0.35)]",
    border: "border-primary/50",
  },
  {
    icon: Shield,
    benefits: [
      "High ORB allocation from airdrop pool",
      "9-month linear vesting schedule",
      "Genesis infrastructure contributor status",
      "Capped at 2,000 holders globally",
    ],
    badge: "Limited",
    badgeVariant: "secondary" as const,
    glow: "shadow-[0_0_30px_oklch(0.68_0.18_290/0.25)]",
    border: "border-primary/30",
  },
  {
    icon: Users,
    benefits: [
      "Standard allocation from community pool",
      "Governance participation rights",
      "Referral programme eligibility",
      "Capped at 10,000 holders globally",
    ],
    badge: "Open",
    badgeVariant: "outline" as const,
    glow: "shadow-[0_0_20px_oklch(0.68_0.18_290/0.15)]",
    border: "border-border",
  },
];

function VerificationBanner({
  verifying,
  verified,
  error,
  tier,
}: {
  verifying: boolean;
  verified: boolean;
  error: string | null;
  tier: number | null;
}) {
  if (!verifying && !verified && !error) return null;

  const tierName = tier ? TIER_CONFIG.find((t) => t.id === tier)?.name : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      {verifying && (
        <div
          data-ocid="tiers.loading_state"
          className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 px-5 py-4 text-foreground"
        >
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p className="font-body text-sm">
            Verifying your purchase{tierName ? ` for ${tierName}` : ""}…
          </p>
        </div>
      )}
      {verified && (
        <div
          data-ocid="tiers.success_state"
          className="flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 px-5 py-4"
        >
          <CheckCircle2 className="h-5 w-5 text-green-400" />
          <div>
            <p className="font-body text-sm font-medium text-green-300">
              Purchase verified!{tierName ? ` Welcome, ${tierName}.` : ""}
            </p>
            <p className="font-body text-xs text-green-400/70">
              Redirecting to your dashboard…
            </p>
          </div>
        </div>
      )}
      {error && (
        <div
          data-ocid="tiers.error_state"
          className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-5 py-4"
        >
          <AlertCircle className="h-5 w-5 text-destructive" />
          <p className="font-body text-sm text-destructive">{error}</p>
        </div>
      )}
    </motion.div>
  );
}

export function TiersPage() {
  const { verifying, verified, error, tier } = usePurchaseVerification();

  return (
    <div
      data-ocid="tiers.page"
      className="min-h-screen bg-background px-4 py-16"
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            <span className="font-body text-sm uppercase tracking-widest text-primary">
              Phantom Lattice ORB Credentials
            </span>
          </div>
          <h1 className="font-display mb-4 text-4xl font-bold text-foreground md:text-5xl">
            Choose Your Tier
          </h1>
          <p className="mx-auto max-w-xl font-body text-base text-muted-foreground">
            Each tier is permanently capped. Secure your place in the lattice
            now — once supply is exhausted, these credentials are gone.
          </p>
        </motion.div>

        {/* Verification banner */}
        <VerificationBanner
          verifying={verifying}
          verified={verified}
          error={error}
          tier={tier}
        />

        {/* Tier cards */}
        <div data-ocid="tiers.list" className="grid gap-6 md:grid-cols-3">
          {TIER_CONFIG.map((tierInfo, index) => {
            const details = TIER_DETAILS[index];
            const Icon = details.icon;
            const stripeUrl = `${tierInfo.stripeLink}?success_url=${encodeURIComponent(`${window.location.origin}/tiers?session_id={CHECKOUT_SESSION_ID}&tier=${tierInfo.id}`)}&cancel_url=${encodeURIComponent(`${window.location.origin}/tiers`)}`;

            return (
              <motion.div
                key={tierInfo.id}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                data-ocid={`tiers.item.${index + 1}`}
              >
                <Card
                  className={`relative flex h-full flex-col border ${
                    details.border
                  } bg-card ${details.glow} transition-all duration-300 hover:scale-[1.02]`}
                >
                  {/* Badge */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge
                      variant={details.badgeVariant}
                      className="px-3 py-0.5 text-xs font-semibold uppercase tracking-wider"
                    >
                      {details.badge}
                    </Badge>
                  </div>

                  <CardHeader className="pt-8 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="font-display text-xl font-bold text-foreground">
                      Tier {tierInfo.id}
                    </h2>
                    <p className="font-body text-sm font-medium text-primary">
                      {tierInfo.name}
                    </p>
                    <div className="mt-3">
                      <span className="font-display text-4xl font-bold text-foreground">
                        ${tierInfo.usdValue}
                      </span>
                      <span className="ml-1 font-body text-sm text-muted-foreground">
                        USD
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="flex flex-1 flex-col gap-5">
                    {/* Description */}
                    <p className="font-body text-center text-sm text-muted-foreground">
                      {tierInfo.description}
                    </p>

                    {/* Benefits */}
                    <ul className="flex flex-1 flex-col gap-2">
                      {details.benefits.map((benefit) => (
                        <li
                          key={benefit}
                          className="flex items-start gap-2 font-body text-sm text-foreground/80"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
                          {benefit}
                        </li>
                      ))}
                    </ul>

                    {/* Buy button */}
                    <a
                      href={stripeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-ocid={`tiers.buy_button.${index + 1}`}
                    >
                      <Button
                        type="button"
                        className="w-full gap-2 bg-primary text-primary-foreground transition-smooth hover:bg-primary/90"
                      >
                        Buy Now — ${tierInfo.usdValue}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Footer notes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex flex-col items-center gap-3 text-center"
        >
          <p className="font-body text-sm text-muted-foreground">
            🎁 You'll receive your NFT within{" "}
            <span className="font-semibold text-foreground">72 hours</span> of
            purchase, delivered to your registered Polygon wallet.
          </p>
          <p className="font-body text-xs text-muted-foreground/60">
            Contract:{" "}
            <span className="font-mono text-muted-foreground">
              0x8dc40ec3b371879b43cc4c6b13198ff091eaacad
            </span>{" "}
            · Polygon Network
          </p>
          <Link
            to="/dashboard"
            data-ocid="tiers.dashboard_link"
            className="font-body text-sm text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
          >
            Already purchased? Check your status →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
