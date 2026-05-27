import { createActor } from "@/backend";
import type { Tier } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation } from "@tanstack/react-query";

export function useRegistration() {
  const { actor } = useActor(createActor);

  return useMutation({
    mutationFn: async ({
      walletAddress,
      tier,
    }: {
      walletAddress: string;
      tier: Tier;
    }) => {
      if (!actor) throw new Error("Backend not connected");
      const result = await (actor as any).registerWallet(
        walletAddress,
        BigInt(tier),
      );
      if (result.__kind__ === "err") {
        if (result.err === "duplicate") {
          throw new Error("This wallet address is already registered");
        }
        throw new Error("Registration failed");
      }
      return result;
    },
  });
}
