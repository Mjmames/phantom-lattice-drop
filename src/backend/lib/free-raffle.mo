import List "mo:core/List";
import RaffleTypes "../types/free-raffle";

module {
  public type FreeRaffleEntry = RaffleTypes.FreeRaffleEntry;
  public type RaffleResult = RaffleTypes.RaffleResult;

  // Register a new wallet for the free raffle.
  // Returns #ok on success, #alreadyRegistered if already exists.
  public func registerRaffle(
    entries : List.List<FreeRaffleEntry>,
    walletAddress : Text,
    now : Int,
  ) : RaffleResult {
    let existing = entries.find(func(e : FreeRaffleEntry) : Bool { e.walletAddress == walletAddress });
    switch (existing) {
      case (?_) { #alreadyRegistered };
      case null {
        entries.add({
          walletAddress;
          entryCount = 1;
          registeredAt = now;
          lastClickAt = now;
        });
        #ok;
      };
    };
  };

  // Claim a daily entry for an existing raffle registrant.
  // Returns #ok on success, #notRegistered if wallet unknown,
  // #cooldownActive if < 86400 seconds since lastClickAt.
  public func claimDailyEntry(
    entries : List.List<FreeRaffleEntry>,
    walletAddress : Text,
    now : Int,
  ) : RaffleResult {
    let existing = entries.find(func(e : FreeRaffleEntry) : Bool { e.walletAddress == walletAddress });
    switch (existing) {
      case null { #notRegistered };
      case (?entry) {
        if (now - entry.lastClickAt < 86_400_000_000_000) {
          #cooldownActive;
        } else {
          entries.mapInPlace(
            func(e : FreeRaffleEntry) : FreeRaffleEntry {
              if (e.walletAddress == walletAddress) {
                { e with entryCount = e.entryCount + 1; lastClickAt = now };
              } else { e };
            }
          );
          #ok;
        };
      };
    };
  };

  // Get the raffle status for a wallet (entry count + last click time).
  public func getRaffleStatus(
    entries : List.List<FreeRaffleEntry>,
    walletAddress : Text,
  ) : RaffleTypes.RaffleStatus {
    let existing = entries.find(func(e : FreeRaffleEntry) : Bool { e.walletAddress == walletAddress });
    switch (existing) {
      case null { #notRegistered };
      case (?entry) {
        #ok({ entryCount = entry.entryCount; lastClickAt = entry.lastClickAt });
      };
    };
  };

  // Return all raffle entries as an immutable array.
  public func listAll(entries : List.List<FreeRaffleEntry>) : [FreeRaffleEntry] {
    entries.toArray();
  };
};
