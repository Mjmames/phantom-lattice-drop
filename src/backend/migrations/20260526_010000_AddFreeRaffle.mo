import List "mo:core/List";
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

  type OldActor = {
    accessControlState : AccessControl.AccessControlState;
    registrations : List.List<Registration>;
  };

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    registrations : List.List<Registration>;
    raffleEntries : List.List<FreeRaffleEntry>;
  };

  public func migration(old : OldActor) : NewActor {
    {
      accessControlState = old.accessControlState;
      registrations = old.registrations;
      raffleEntries = List.empty<FreeRaffleEntry>();
    };
  };
};
