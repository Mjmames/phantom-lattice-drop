import Common "common";

module {
  public type FreeRaffleEntry = {
    walletAddress : Text;
    entryCount : Nat;
    registeredAt : Common.Timestamp;
    lastClickAt : Common.Timestamp;
  };

  public type RaffleResult = {
    #ok;
    #alreadyRegistered;
    #notRegistered;
    #cooldownActive;
  };

  public type RaffleStatus = {
    #ok : { entryCount : Nat; lastClickAt : Int };
    #notRegistered;
  };
};
