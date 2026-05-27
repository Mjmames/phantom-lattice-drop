export enum Tier {
  Tier1 = 1,
  Tier2 = 2,
  Tier3 = 3,
}

export interface TierInfo {
  id: Tier;
  name: string;
  description: string;
  usdValue: number;
  stripeLink: string;
}

export const TIER_CONFIG: TierInfo[] = [
  {
    id: Tier.Tier1,
    name: "Testnet Node Operator",
    description: "Highest allocation. 12-month linear vest.",
    usdValue: 500,
    stripeLink: "https://buy.stripe.com/7sYfZh5IddiC7ajfb0gMw06",
  },
  {
    id: Tier.Tier2,
    name: "Genesis Node Operator",
    description: "High allocation. 9-month linear vest.",
    usdValue: 150,
    stripeLink: "https://buy.stripe.com/3cI14neeJ92m3Y7fb0gMw07",
  },
  {
    id: Tier.Tier3,
    name: "Community Contributor",
    description: "Standard allocation. Governance & referral eligible.",
    usdValue: 25,
    stripeLink: "https://buy.stripe.com/28E00j9Yt3I266f6EugMw08",
  },
];

export interface FreeRaffleEntry {
  walletAddress: string;
  entryCount: bigint;
  registeredAt: bigint;
  lastClickAt: bigint;
}

export type RaffleStatus =
  | { __kind__: "ok"; ok: { entryCount: bigint; lastClickAt: bigint } }
  | { __kind__: "notRegistered" }
  | { __kind__: "cooldownActive"; remainingMs: bigint };

export function getTierInfo(tier: Tier): TierInfo | undefined {
  return TIER_CONFIG.find((t) => t.id === tier);
}

export interface VerifiedPurchase {
  tier: Tier;
  stripeSessionId: string;
  purchasedAt: bigint;
  walletAddress: string;
}

export type PurchaseVerificationResult =
  | { __kind__: "ok" }
  | { __kind__: "err"; err: string };
