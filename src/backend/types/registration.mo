import Debug "mo:core/Debug";
import Common "common";

module {
  public type Registration = {
    walletAddress : Text;
    tier : Common.Tier;
    timestamp : Common.Timestamp;
  };

  public type RegisterResult = {
    #ok;
    #err : { #duplicate; #invalidTier };
  };

  public type TierCounts = {
    tier1 : Nat;
    tier2 : Nat;
    tier3 : Nat;
  };
};
