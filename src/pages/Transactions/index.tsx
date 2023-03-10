import {css} from "catom";
import {CardInput, CardInputObj} from "~/components/CardInput";
import {Nav} from "~/components/Nav";
import {SafeLayout} from "~/components/SafeLayout";
import {
  ITx,
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
import {Modal} from "@hydrophobefireman/kit/modal";
import {Text} from "@hydrophobefireman/kit/text";
import {useState} from "@hydrophobefireman/ui-lib";

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
  const [activeTx, setActiveTx] = useState<ITx>(null);
  if (!virtCards?.cards?.map || !physicalCards?.cards?.map) return;
  const o = Object.fromEntries(virtCards.cards.map((x) => [x.card_id, x]));
  const pMap = Object.fromEntries(
    physicalCards.cards.map((x) => [x.card_id, x])
  );
  return (
    <Box
      class={css({
        "--kit-foreground": "black",
        color: "black",
        borderRadius: "15px",
        background: "var(--light-gradient);",
      } as any)}
    >
      {!resp?.length ? (
        <Text.h1>Your transactions will show up here</Text.h1>
      ) : null}
      <Box
        class={css({
          gap: "1.5rem",
          width: "100%",
          maxWidth: "600px",
          boxShadow: "var(--kit-shadow)",
          padding: "3rem",
        })}
      >
        {activeTx && (
          <Modal
            active
            onClickOutside={() => setActiveTx(null)}
            onEscape={() => setActiveTx(null)}
          >
            <Text.h1
              class={css({
                fontWeight: "bold",
                fontSize: "1.2rem",
                textAlign: "center",
                margin: "0.5rem",
              })}
            >
              Cards Used
            </Text.h1>
            <Box>
              {activeTx.cards_used.map((x) => (
                <div>
                  <div
                    role="button"
                    class={css({
                      filter: "hue-rotate(0deg) drop-shadow(2px 4px 6px black)",
                      marginBottom: "1rem",
                    })}
                  >
                    <CardInputObj card={pMap[x[0]]} />
                  </div>
                  <div class={css({marginTop: "1rem"})}>${x[1]}</div>
                </div>
              ))}
            </Box>
          </Modal>
        )}
        {resp
          ?.sort((a, b) => -a.date.localeCompare(b.date))
          .map((x) => {
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
                    filter: "hue-rotate(45deg) drop-shadow(2px 4px 6px black)",
                    top: "0",
                    left: "0",
                  })}
                >
                  <CardInput
                    cvc={card.card_cvv}
                    expiry={`${card.card_expiry.month}/${card.card_expiry.year}`}
                    focused="name"
                    number={card.card_number}
                    name={card.name}
                  />
                </div>
                <div
                  class={css({
                    width: "100%",
                    gap: "2rem",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                  })}
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
                    <button onClick={() => setActiveTx(x)}>
                      <DotsHorizontalIcon
                        class={css({transform: "rotate(90deg)"})}
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </Box>
    </Box>
  );
}
