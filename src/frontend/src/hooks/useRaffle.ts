import { createActor } from "@/backend";
import type { RaffleStatus } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useRaffleRegister() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (walletAddress: string) => {
      if (!actor) throw new Error("Backend not connected");
      const result = await (actor as any).registerRaffle(walletAddress);
      if (result === "alreadyRegistered") {
        throw new Error("This wallet is already registered for the raffle");
      }
      return result;
    },
    onSuccess: (_data, walletAddress) => {
      queryClient.invalidateQueries({
        queryKey: ["raffleStatus", walletAddress],
      });
      queryClient.invalidateQueries({ queryKey: ["raffleEntries"] });
    },
  });
}

export function useRaffleClaim() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (walletAddress: string) => {
      if (!actor) throw new Error("Backend not connected");
      const result = await (actor as any).claimDailyEntry(walletAddress);
      if (result === "cooldownActive") {
        throw new Error(
          "Cooldown active — please wait 24 hours between claims",
        );
      }
      if (result === "notRegistered") {
        throw new Error("Wallet not registered for the raffle");
      }
      return result;
    },
    onSuccess: (_data, walletAddress) => {
      queryClient.invalidateQueries({
        queryKey: ["raffleStatus", walletAddress],
      });
      queryClient.invalidateQueries({ queryKey: ["raffleEntries"] });
    },
  });
}

export function useRaffleStatus(walletAddress: string) {
  const { actor, isFetching: actorLoading } = useActor(createActor);

  return useQuery<RaffleStatus>({
    queryKey: ["raffleStatus", walletAddress],
    queryFn: async () => {
      if (!actor) return { __kind__: "notRegistered" };
      const result = await (actor as any).getFreeRaffleStatus(walletAddress);
      return result as RaffleStatus;
    },
    enabled: !!actor && !actorLoading && walletAddress.length > 0,
  });
}

export function useFreeRaffleEntries() {
  const { actor, isFetching: actorLoading } = useActor(createActor);

  return useQuery({
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
}
