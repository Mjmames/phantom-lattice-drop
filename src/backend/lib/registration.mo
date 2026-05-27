import List "mo:core/List";
import Time "mo:core/Time";
import Common "../types/common";
import RegTypes "../types/registration";

module {
  public type Registration = RegTypes.Registration;
  public type RegisterResult = RegTypes.RegisterResult;
  public type TierCounts = RegTypes.TierCounts;

  /// Add a new registration, rejecting duplicates by wallet address.
  public func register(
    registrations : List.List<Registration>,
    walletAddress : Text,
    tier : Common.Tier,
  ) : RegisterResult {
    // Validate tier is 1, 2, or 3
    if (tier < 1 or tier > 3) {
      return #err(#invalidTier);
    };
    // Reject duplicate wallet addresses
    let existing = registrations.find(func(r : Registration) : Bool {
      r.walletAddress == walletAddress
    });
    switch (existing) {
      case (?_) { #err(#duplicate) };
      case null {
        let entry : Registration = {
          walletAddress;
          tier;
          timestamp = Time.now();
        };
        registrations.add(entry);
        #ok;
      };
    };
  };

  /// Return all registrations.
  public func listAll(
    registrations : List.List<Registration>,
  ) : [Registration] {
    registrations.toArray();
  };

  /// Return count per tier.
  public func tierCounts(
    registrations : List.List<Registration>,
  ) : TierCounts {
    var t1 = 0;
    var t2 = 0;
    var t3 = 0;
    for (r in registrations.values()) {
      if (r.tier == 1) { t1 += 1 }
      else if (r.tier == 2) { t2 += 1 }
      else if (r.tier == 3) { t3 += 1 };
    };
    { tier1 = t1; tier2 = t2; tier3 = t3 };
  };
};
