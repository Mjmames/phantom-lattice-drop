import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Common "../types/common";
import PurchaseTypes "../types/purchase";

module {
  public type VerifiedPurchase = PurchaseTypes.VerifiedPurchase;
  public type PurchaseResult = PurchaseTypes.PurchaseResult;
  public type PurchaseRecord = PurchaseTypes.PurchaseRecord;

  /// Record a verified purchase. Rejects replay attacks via duplicate stripeSessionId.
  public func recordPurchase(
    purchases : Map.Map<Principal, List.List<VerifiedPurchase>>,
    usedSessions : Map.Map<Text, Bool>,
    principal : Principal,
    tier : Common.Tier,
    stripeSessionId : Text,
  ) : PurchaseResult {
    if (tier < 1 or tier > 3) {
      return #err(#invalidTier);
    };
    // Replay-attack prevention: reject already-used session IDs
    switch (usedSessions.get(stripeSessionId)) {
      case (?_) { return #err(#duplicate) };
      case null {};
    };
    usedSessions.add(stripeSessionId, true);
    let entry : VerifiedPurchase = {
      principal;
      tier;
      stripeSessionId;
      timestamp = Time.now();
    };
    switch (purchases.get(principal)) {
      case (?list) { list.add(entry) };
      case null {
        let list = List.empty<VerifiedPurchase>();
        list.add(entry);
        purchases.add(principal, list);
      };
    };
    #ok;
  };

  /// Return verified tier numbers for a principal.
  public func getMyPurchases(
    purchases : Map.Map<Principal, List.List<VerifiedPurchase>>,
    principal : Principal,
  ) : [Nat] {
    switch (purchases.get(principal)) {
      case (?list) {
        list.map<VerifiedPurchase, Nat>(func(p) { p.tier }).toArray();
      };
      case null { [] };
    };
  };

};
