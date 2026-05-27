import Common "common";

module {
  public type VerifiedPurchase = {
    principal : Principal;
    tier : Common.Tier;
    stripeSessionId : Text;
    timestamp : Int;
  };

  public type PurchaseResult = {
    #ok;
    #err : { #duplicate; #invalidTier };
  };

  public type PurchaseRecord = {
    principal : Principal;
    tiers : [Nat];
    walletAddress : ?Text;
  };
};
