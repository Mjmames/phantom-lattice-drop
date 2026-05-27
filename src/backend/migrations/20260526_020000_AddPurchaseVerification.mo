import List "mo:core/List";
import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";

module {
  type Registration = {
    walletAddress : Text;
    tier : Nat;
    timestamp : Int;
  };

  type FreeRaffleEntry = {
    walletAddress : Text;
    entryCount : Nat;
    registeredAt : Int;
    lastClickAt : Int;
  };

  type VerifiedPurchase = {
    principal : Principal;
    tier : Nat;
    stripeSessionId : Text;
    timestamp : Int;
  };

  type OldActor = {
    accessControlState : AccessControl.AccessControlState;
    registrations : List.List<Registration>;
    raffleEntries : List.List<FreeRaffleEntry>;
  };

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    registrations : List.List<Registration>;
    raffleEntries : List.List<FreeRaffleEntry>;
    purchases : Map.Map<Principal, List.List<VerifiedPurchase>>;
    usedSessions : Map.Map<Text, Bool>;
  };

  public func migration(old : OldActor) : NewActor {
    {
      accessControlState = old.accessControlState;
      registrations = old.registrations;
      raffleEntries = old.raffleEntries;
      purchases = Map.empty<Principal, List.List<VerifiedPurchase>>();
      usedSessions = Map.empty<Text, Bool>();
    };
  };
};
