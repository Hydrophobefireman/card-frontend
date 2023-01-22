import {css} from "catom";
import {CardInput} from "~/components/CardInput";
import {Nav} from "~/components/Nav";
import {SafeLayout} from "~/components/SafeLayout";
import {
  usePhysicalCards,
  useTransactions,
  useVirtualCards,
} from "~/handlers/cards";

import {
  DotsHorizontalIcon,
  MenuAlt3Icon,
  MenuIcon,
} from "@hydrophobefireman/kit-icons";
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
      <Box
        class={css({
          gap: "1.5rem",
          width: "100%",
          maxWidth: "600px",
          boxShadow: "var(--kit-shadow)",
          padding: "3rem",
        })}
      >
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
                  transform: "scale(.25) translate(-30rem,-17rem)",
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
              <Box
                row
                horizontal="left"
                class={css({width: "100%", gap: "2rem"})}
              >
                <div class={css({marginLeft: "5rem"})}>
                  <Text.div color="kit-shade-5">${x.amount}</Text.div>
                  <div>{x.name}</div>
                </div>
                <div>
                  <div>{x.category}</div>
                  <div>{new Date(+x.date * 1000).toDateString()}</div>
                </div>
                <div
                  class={css({
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "flex-end",
                    display: "flex",
                  })}
                >
                  <button>
                    <DotsHorizontalIcon
                      class={css({transform: "rotate(90deg)"})}
                    />
                  </button>
                </div>
              </Box>
            </div>
          );
        })}
      </Box>
    </Box>
  );
}
