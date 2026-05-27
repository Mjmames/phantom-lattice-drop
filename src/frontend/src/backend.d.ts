import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type RegisterResult = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Variant_duplicate_invalidTier;
};
export type Timestamp = bigint;
export interface TierCounts {
    tier1: bigint;
    tier2: bigint;
    tier3: bigint;
}
export type PurchaseResult = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Variant_duplicate_invalidTier;
};
export interface PurchaseRecord {
    tiers: Array<bigint>;
    principal: Principal;
    walletAddress?: string;
}
export interface Registration {
    tier: Tier;
    walletAddress: string;
    timestamp: Timestamp;
}
export type RaffleStatus = {
    __kind__: "ok";
    ok: {
        entryCount: bigint;
        lastClickAt: bigint;
    };
} | {
    __kind__: "notRegistered";
    notRegistered: null;
};
export type Tier = bigint;
export interface FreeRaffleEntry {
    entryCount: bigint;
    walletAddress: string;
    lastClickAt: Timestamp;
    registeredAt: Timestamp;
}
export enum RaffleResult {
    ok = "ok",
    cooldownActive = "cooldownActive",
    alreadyRegistered = "alreadyRegistered",
    notRegistered = "notRegistered"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_duplicate_invalidTier {
    duplicate = "duplicate",
    invalidTier = "invalidTier"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    claimDailyEntry(walletAddress: string): Promise<RaffleResult>;
    getCallerUserRole(): Promise<UserRole>;
    getFreeRaffleStatus(walletAddress: string): Promise<RaffleStatus>;
    getMyPurchases(): Promise<Array<bigint>>;
    getTierCounts(password: string): Promise<TierCounts>;
    isCallerAdmin(): Promise<boolean>;
    listAllPurchases(password: string): Promise<Array<PurchaseRecord>>;
    listRaffleEntries(password: string): Promise<Array<FreeRaffleEntry>>;
    listRegistrations(password: string): Promise<Array<Registration>>;
    recordPurchaseVerification(tier: bigint, stripeSessionId: string): Promise<PurchaseResult>;
    registerRaffle(walletAddress: string): Promise<RaffleResult>;
    registerWallet(walletAddress: string, tier: bigint): Promise<RegisterResult>;
}
