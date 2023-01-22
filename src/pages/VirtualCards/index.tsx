import {css} from "catom";
import {CardInput, CardInputObj} from "~/components/CardInput";
import {Form} from "~/components/Form";
import {Nav} from "~/components/Nav";
import {SafeLayout} from "~/components/SafeLayout";
import {ThemeInput} from "~/components/ThemeInput";
import {
  IVirtualCard,
  addVirtualCard,
  deleteVirtualCard,
  usePhysicalCards,
  useVirtualCards,
} from "~/handlers/cards";
import {useAuthState} from "~/util/bridge";

import {PlusIcon} from "@hydrophobefireman/kit-icons";
import {useAlerts} from "@hydrophobefireman/kit/alerts";
import {TextButton} from "@hydrophobefireman/kit/button";
import {Box} from "@hydrophobefireman/kit/container";
import {Text} from "@hydrophobefireman/kit/text";
import {useState} from "@hydrophobefireman/ui-lib";
import {Modal} from "@kit/modal";

export default function VirtualCards() {
  return (
    <SafeLayout>
      <Nav />
      <CardRenderer />
    </SafeLayout>
  );
}

function CardRenderer() {
  const {resp, fetchResource} = useVirtualCards();
  const [addCardModel, setAddCardModel] = useState(false);
  const [showCard, setShowCard] = useState<IVirtualCard>();
  function showCardInfo(x: IVirtualCard) {
    setShowCard(x);
  }
  const [user] = useAuthState();
  return (
    <div class={css({padding: "2.5rem"})}>
      <Text.h1 class={css({fontSize: "1.5rem", fontWeight: "bold"})}>
        Your Virtual Cards
      </Text.h1>
      <Box horizontal="center">
        {showCard && (
          <CardDetails
            card={showCard}
            close={() => {
              setShowCard(null);
              fetchResource();
            }}
          />
        )}
        <CardInputModal
          fetchCards={fetchResource}
          active={addCardModel}
          close={() => setAddCardModel(false)}
        />
        <TextButton
          prefix={<PlusIcon color="white" />}
          mode="success"
          onClick={() => {
            setAddCardModel(true);
          }}
          class={css({
            "--kit-radius": "15px",
            "--stroke": "white",
            pseudo: {
              ":hover": {
                "--stroke": "var(--kit-theme-fg)",
              },
              ":active": {
                "--stroke": "var(--kit-theme-fg)",
              },
              ":focus": {
                "--stroke": "var(--kit-theme-fg)",
              },
              " svg": {
                stroke: "var(--stroke)",
              },
            },
          } as any)}
        >
          Create Card
        </TextButton>
      </Box>
      <Box
        row
        class={css({marginTop: "2rem", gap: "1.5rem", flexWrap: "wrap"})}
      >
        {resp?.cards
          ?.filter((x) => x.active)
          .map((x) => (
            <div
              role="button"
              class={css({filter: "hue-rotate(45deg)"})}
              onClick={() => showCardInfo(x)}
            >
              <CardInput
                cvc={x.card_cvv}
                expiry={x.card_expiry}
                name={x.name ?? user.name}
                number={x.card_number}
                focused="name"
              />
            </div>
          ))}
      </Box>
    </div>
  );
}

function CardDetails({card, close}: {card: IVirtualCard; close(): void}) {
  const {resp} = usePhysicalCards();
  const {persist} = useAlerts();
  if (!resp?.cards?.map) return;
  async function handleDelete() {
    const {result} = deleteVirtualCard(card);
    const {error} = await result;
    if (error) {
      persist({
        content: error,
        type: "error",
        onActionClick: handleDelete,
        actionText: "retry",
      });
      return;
    }
    close();
  }
  return (
    <Modal active onEscape={close} onClickOutside={close}>
      <Box class={css({margin: "2rem"})}>
        <Box
          class={css({width: "100%", marginBottom: "1rem"})}
          horizontal="right"
        >
          <TextButton mode="error" onClick={handleDelete}>
            delete
          </TextButton>
        </Box>
        <div class={css({filter: "hue-rotate(45deg)"})}>
          <CardInput
            cvc={card.card_cvv}
            expiry={card.card_expiry}
            name={card.name}
            number={card.card_number}
            focused="name"
          />
        </div>
        <div class={css({marginTop: "2rem"})}></div>
        <ThemeInput label="Spent" value={"" + card.config.spent} disabled />
        <ThemeInput label="CVV" value={"" + card.card_cvv} disabled />
        <ThemeInput label="Zip" value={"" + card.card_zipcode} disabled />
        <Box row class={css({flexWrap: "wrap"})}></Box>
      </Box>
    </Modal>
  );
}

export function CardInputModal({
  active,
  close,
  fetchCards,
}: {
  active: boolean;
  close(): void;
  fetchCards: Function;
}) {
  const {resp} = usePhysicalCards();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const {persist} = useAlerts();
  if (!resp?.cards?.map) return;
  async function handleSubmit() {
    if (!selectedIds.size) return;
    const {result} = addVirtualCard([...selectedIds]);
    const {data, error} = await result;
    if (error) {
      persist({
        content: error,
        type: "error",
        onActionClick: handleSubmit,
        actionText: "retry",
      });
      return;
    }
    await fetchCards();
    close();
  }
  return (
    <Modal active={active} onClickOutside={close} onEscape={close}>
      <Text.h1
        class={css({
          fontSize: "1.2rem",
          fontWeight: "bold",
          margin: "0.5rem",
          textAlign: "center",
        })}
      >
        Select physical cards
      </Text.h1>
      <Form onSubmit={handleSubmit}>
        <Box class={css({gap: "2rem", padding: "0.25rem"})}>
          {resp.cards
            .filter((x) => x.active)
            .map((card) => (
              <div
                role="button"
                class={[
                  css({transition: "var(--kit-transition)"}),
                  selectedIds.has(card.card_id)
                    ? ""
                    : css({filter: "grayscale(1)"}),
                ]}
                onClick={() => {
                  setSelectedIds((p) => {
                    const next = new Set(p);
                    if (next.has(card.card_id)) {
                      next.delete(card.card_id);
                    } else {
                      next.add(card.card_id);
                    }
                    return next;
                  });
                }}
              >
                <CardInputObj card={card} />
              </div>
            ))}
          <TextButton mode="success" variant="shadow">
            Create
          </TextButton>
        </Box>
      </Form>
    </Modal>
  );
}
