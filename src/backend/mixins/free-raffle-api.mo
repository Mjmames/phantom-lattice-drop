import List "mo:core/List";
import Time "mo:core/Time";
import RaffleTypes "../types/free-raffle";
import FreeRaffleLib "../lib/free-raffle";
import Runtime "mo:core/Runtime";

mixin (
  raffleEntries : List.List<RaffleTypes.FreeRaffleEntry>,
) {
  // Register a wallet address for a chance to join the free raffle.
  public func registerRaffle(walletAddress : Text) : async RaffleTypes.RaffleResult {
    FreeRaffleLib.registerRaffle(raffleEntries, walletAddress, Time.now());
  };

  // Claim a daily entry (once per 24 hours) for an existing registrant.
  public func claimDailyEntry(walletAddress : Text) : async RaffleTypes.RaffleResult {
    FreeRaffleLib.claimDailyEntry(raffleEntries, walletAddress, Time.now());
  };

  // Get the raffle status for a wallet address.
  public query func getFreeRaffleStatus(walletAddress : Text) : async RaffleTypes.RaffleStatus {
    FreeRaffleLib.getRaffleStatus(raffleEntries, walletAddress);
  };

  // Admin: list all free raffle entries.
  public func listRaffleEntries(password : Text) : async [RaffleTypes.FreeRaffleEntry] {
    if (password != "Mmandk280315$") {
      Runtime.trap("Unauthorized");
    };
    FreeRaffleLib.listAll(raffleEntries);
  };
};
