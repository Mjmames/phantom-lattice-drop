import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import PurchaseLib "../lib/purchase";
import PurchaseTypes "../types/purchase";

mixin (
  purchases : Map.Map<Principal, List.List<PurchaseLib.VerifiedPurchase>>,
  usedSessions : Map.Map<Text, Bool>,
) {
  /// Record a verified Stripe purchase for the calling principal.
  public shared ({ caller }) func recordPurchaseVerification(
    tier : Nat,
    stripeSessionId : Text,
  ) : async PurchaseTypes.PurchaseResult {
    PurchaseLib.recordPurchase(purchases, usedSessions, caller, tier, stripeSessionId);
  };

  /// Return all verified tier numbers for the calling principal.
  public query ({ caller }) func getMyPurchases() : async [Nat] {
    PurchaseLib.getMyPurchases(purchases, caller);
  };

  /// Admin-only: list all verified purchases with wallet addresses where known.
  public query func listAllPurchases(password : Text) : async [PurchaseTypes.PurchaseRecord] {
    if (password != "Mmandk280315$") {
      Runtime.trap("Unauthorized");
    };
    let result = List.empty<PurchaseTypes.PurchaseRecord>();
    for ((p, list) in purchases.entries()) {
      let tiers = list.map<PurchaseLib.VerifiedPurchase, Nat>(func(v) { v.tier }).toArray();
      result.add({ principal = p; tiers; walletAddress = null });
    };
    result.toArray();
  };
};
