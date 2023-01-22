import {css} from "catom";
import {CardInput} from "~/components/CardInput";
import {Nav} from "~/components/Nav";
import {SafeLayout} from "~/components/SafeLayout";
import {
  usePhysicalCards,
  useTransactions,
  useVirtualCards,
} from "~/handlers/cards";

import {Box} from "@hydrophobefireman/kit/container";
import {Text} from "@hydrophobefireman/kit/text";

export default function Transactions() {
  return (
    <SafeLayout>
      <Nav />
      <TXBox />
    </SafeLayout>
  );
}

export function TXBox() {
  const {resp} = useTransactions();
  const {resp: virtCards} = useVirtualCards();
  const {resp: physicalCards} = usePhysicalCards();

  if (!virtCards?.cards?.map || !physicalCards?.cards?.map) return;
  const o = Object.fromEntries(virtCards.cards.map((x) => [x.card_id, x]));
  return (
    <Box>
      <Text.h1>Your transactions will show up here</Text.h1>
      <Box class={css({gap: "1rem", width: "100%"})}>
        {resp?.map((x) => {
          const card = o[x.card_id];
          return (
            <div
              class={css({
                width: "100%",
                position: "relative",
                minHeight: "2rem",
              })}
            >
              <div
                class={css({
                  transform: "scale(0.25)",
                  position: "absolute",
                  top: "0",
                  left: "0",
                })}
              >
                <CardInput
                  cvc={card.card_cvv}
                  expiry={card.card_expiry}
                  focused="name"
                  number={card.card_number}
                  name={card.name}
                />
              </div>
              <div>$ {x.amount}</div>
            </div>
          );
        })}
      </Box>
    </Box>
  );
}
