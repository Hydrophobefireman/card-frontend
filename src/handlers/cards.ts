import {createState} from "statedrive";
import {requests} from "~/util/bridge";

import {useCachingResource, useResource} from "@hydrophobefireman/kit/hooks";

import {
  addVirtualCardRoute,
  deletePhysicalCardsRoute,
  deleteVirtualCardRoute,
  getPhysicalCardsRoute,
  getVirtualCardsRoute,
  listTxRoute,
  patchPhysicalCardsRoute,
  putPhysicalCardsRoute,
} from "./routes";

export interface IPhysicalCard {
  card_id: string;
  blob: {
    limit: number;
    spent: number;
    cvc: string;
    expiry: {month: number; year: number};
    name: string;
    number: string;
    provider: string;
    version: "gold" | "platinum" | "infinite" | "standard" | "world";
  };
  id_: string;
  active: boolean;
}

export interface IVirtualCard {
  card_id: string;
  id_: string;
  card_number: string;
  card_cvv: string;
  card_expiry: {month: string; year: string};
  name: string;
  card_address: string;
  card_zipcode: string;
  card_limit: "@NA";
  active: boolean;
  config: {
    physical_ids: string[];
    spent: number;
  };
}
const store = createState({});
const vstore = createState({});
export function usePhysicalCards() {
  return useCachingResource(
    () =>
      requests.get<{
        cards: IPhysicalCard[];
      }>(getPhysicalCardsRoute),
    [],
    store
  );
}
export function useVirtualCards() {
  return useCachingResource(
    () =>
      requests.get<{
        cards: IVirtualCard[];
      }>(getVirtualCardsRoute),
    [],
    vstore
  );
}

export function addPhysicalCard(obj: {
  provider: string;
  name: string;
  expiry: {month: number; year: number};
  number: string;
  version: string;
  cvc: string;
}) {
  return requests.putJSON(putPhysicalCardsRoute, obj);
}

export function deletePhysicalCard(card: IPhysicalCard) {
  return requests.del(deletePhysicalCardsRoute(card.card_id));
}

export function deleteVirtualCard(card: IVirtualCard) {
  return requests.del(deleteVirtualCardRoute(card.card_id));
}

export function updatePhysicalCard(
  card: IPhysicalCard,
  blob: IPhysicalCard["blob"]
) {
  return requests.patchJSON(patchPhysicalCardsRoute(card.card_id), blob);
}

export function addVirtualCard(selectedIds: string[]) {
  return requests.postJSON(addVirtualCardRoute, {physical_ids: selectedIds});
}
export interface ITx {
  card_id: string;
  tx_id: string;
  user_id: string;
  date: string;
  amount: string;
  category: string;
  name: string;
  cards_used: Array<[string, number]>;
}
export function useTransactions() {
  return useResource(() => requests.get<ITx[]>(listTxRoute), []);
}
