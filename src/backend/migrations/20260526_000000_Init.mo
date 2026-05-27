import List "mo:core/List";
import AccessControl "mo:caffeineai-authorization/access-control";

module {
  type Registration = {
    walletAddress : Text;
    tier : Nat;
    timestamp : Int;
  };

  type OldActor = {};

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    registrations : List.List<Registration>;
  };

  public func migration(_ : OldActor) : NewActor {
    {
      accessControlState = AccessControl.initState();
      registrations = List.empty<Registration>();
    };
  };
};
