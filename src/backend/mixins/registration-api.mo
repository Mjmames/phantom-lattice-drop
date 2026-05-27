import List "mo:core/List";
import AccessControl "mo:caffeineai-authorization/access-control";
import Runtime "mo:core/Runtime";
import RegLib "../lib/registration";
import RegTypes "../types/registration";

mixin (
  accessControlState : AccessControl.AccessControlState,
  registrations : List.List<RegLib.Registration>,
) {
  /// Register a wallet address with a tier. Returns #ok or #err(#duplicate).
  public shared func registerWallet(
    walletAddress : Text,
    tier : Nat,
  ) : async RegTypes.RegisterResult {
    if (tier < 1 or tier > 3) {
      return #err(#duplicate); // reuse error type; caller should pass valid tier
    };
    RegLib.register(registrations, walletAddress, tier);
  };

  /// Admin-only: retrieve all submissions.
  public query func listRegistrations(password : Text) : async [RegLib.Registration] {
    if (password != "Mmandk280315$") {
      Runtime.trap("Unauthorized");
    };
    RegLib.listAll(registrations);
  };

  /// Admin-only: return counts per tier.
  public query func getTierCounts(password : Text) : async RegTypes.TierCounts {
    if (password != "Mmandk280315$") {
      Runtime.trap("Unauthorized");
    };
    RegLib.tierCounts(registrations);
  };
};
