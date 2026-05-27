import { createActor } from "@/backend";
import type { Tier } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";

export function useMyPurchases() {
  const { actor, isFetching: actorLoading } = useActor(createActor);

  return useQuery<Tier[]>({
    queryKey: ["myPurchases"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getMyPurchases();
      return result.map((t) => Number(t) as Tier);
    },
    enabled: !!actor && !actorLoading,
  });
}
