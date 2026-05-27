import List "mo:core/List";
import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import RegTypes "types/registration";
import RegistrationMixin "mixins/registration-api";
import RaffleTypes "types/free-raffle";
import FreeRaffleMixin "mixins/free-raffle-api";
import PurchaseTypes "types/purchase";
import PurchaseMixin "mixins/purchase-api";

actor {
  let accessControlState : AccessControl.AccessControlState;
  let registrations : List.List<RegTypes.Registration>;
  let raffleEntries : List.List<RaffleTypes.FreeRaffleEntry>;
  let purchases : Map.Map<Principal, List.List<PurchaseTypes.VerifiedPurchase>>;
  let usedSessions : Map.Map<Text, Bool>;

  include MixinAuthorization(accessControlState);
  include RegistrationMixin(accessControlState, registrations);
  include FreeRaffleMixin(raffleEntries);
  include PurchaseMixin(purchases, usedSessions);
};
