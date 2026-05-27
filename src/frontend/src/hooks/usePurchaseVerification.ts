import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export interface PurchaseVerificationState {
  verifying: boolean;
  verified: boolean;
  error: string | null;
  tier: number | null;
  sessionId: string | null;
}

export function usePurchaseVerification(): PurchaseVerificationState {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const hasVerified = useRef(false);

  const rawSessionId = searchParams.get("session_id");
  const rawTier = searchParams.get("tier");

  const [state, setState] = useState<PurchaseVerificationState>({
    verifying: !!(rawSessionId && rawTier),
    verified: false,
    error: null,
    tier: rawTier ? Number(rawTier) : null,
    sessionId: rawSessionId,
  });

  const verify = useCallback(async () => {
    if (!rawSessionId || !rawTier || !actor || isFetching) return;
    if (hasVerified.current) return;
    hasVerified.current = true;

    const tierNum = Number(rawTier);
    if (![1, 2, 3].includes(tierNum)) {
      setState((prev) => ({
        ...prev,
        verifying: false,
        error: "Invalid tier specified in return URL.",
      }));
      return;
    }

    try {
      const result = await actor.recordPurchaseVerification(
        BigInt(tierNum),
        rawSessionId,
      );

      if (result.__kind__ === "ok") {
        setState((prev) => ({ ...prev, verifying: false, verified: true }));
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        const errMsg =
          result.err === "duplicate"
            ? "This purchase has already been verified."
            : "Invalid tier — verification failed.";
        setState((prev) => ({ ...prev, verifying: false, error: errMsg }));
      }
    } catch {
      setState((prev) => ({
        ...prev,
        verifying: false,
        error: "Verification failed. Please contact support.",
      }));
    }
  }, [rawSessionId, rawTier, actor, isFetching, navigate]);

  useEffect(() => {
    if (rawSessionId && rawTier && actor && !isFetching) {
      verify();
    }
  }, [rawSessionId, rawTier, actor, isFetching, verify]);

  return state;
}
