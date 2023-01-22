import {css} from "catom";
import {fns} from "payment";
import {CardInput, CardInputObj} from "~/components/CardInput";
import {Form} from "~/components/Form";
import {Nav} from "~/components/Nav";
import {SafeLayout} from "~/components/SafeLayout";
import {ThemeInput} from "~/components/ThemeInput";
import {
  IPhysicalCard,
  addPhysicalCard,
  deletePhysicalCard,
  updatePhysicalCard,
  usePhysicalCards,
} from "~/handlers/cards";
import {useAuthState} from "~/util/bridge";

import {PlusIcon} from "@hydrophobefireman/kit-icons";
import {useAlerts} from "@hydrophobefireman/kit/alerts";
import {TextButton} from "@hydrophobefireman/kit/button";
import {Box} from "@hydrophobefireman/kit/container";
import {Text} from "@hydrophobefireman/kit/text";
import {useState} from "@hydrophobefireman/ui-lib";
import {Modal} from "@kit/modal";

export default function PhysicalCards() {
  return (
    <SafeLayout>
      <Nav />
      <CardRenderer />
    </SafeLayout>
  );
}

function CardRenderer() {
  const {resp, fetchResource} = usePhysicalCards();
  const [addCardModel, setAddCardModel] = useState(false);
  const [showCard, setShowCard] = useState<IPhysicalCard>();
  function showCardInfo(x: IPhysicalCard) {
    setShowCard(x);
  }
  return (
    <div class={css({padding: "2.5rem"})}>
      <Text.h1 class={css({fontSize: "1.5rem", fontWeight: "bold"})}>
        Your Physical Cards
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
          Connect card
        </TextButton>
      </Box>
      <Box
        row
        class={css({marginTop: "2rem", gap: "1.5rem", flexWrap: "wrap"})}
      >
        {resp?.cards
          ?.filter((x) => x.active)
          .map((x) => (
            <div role="button" onClick={() => showCardInfo(x)}>
              <CardInputObj card={x} focused="name" />
            </div>
          ))}
      </Box>
    </div>
  );
}

function CardDetails({card, close}: {card: IPhysicalCard; close(): void}) {
  const {persist} = useAlerts();

  const [limit, setLimit] = useState<string>(String(card?.blob.limit ?? 0));
  async function deleteCard(card: IPhysicalCard) {
    const {result} = deletePhysicalCard(card);
    const {data, error} = await result;

    close();
    if (error) {
      persist({
        content: error,
        type: "error",
        onActionClick: () => deleteCard(card),
        actionText: "retry",
      });
      return;
    }
  }
  return (
    <Modal onClickOutside={close} onEscape={close} active={!!card}>
      <Box class={css({width: "100%", padding: "1rem"})}>
        <Box
          horizontal="right"
          class={css({width: "100%", marginBottom: "1rem"})}
        >
          <TextButton
            mode="error"
            variant="shadow"
            onClick={() => deleteCard(card)}
          >
            delete
          </TextButton>
        </Box>

        <CardInputObj card={card} focused="name" />
        <Form
          onSubmit={async () => {
            const {result} = updatePhysicalCard(card, {
              ...card.blob,
              limit: +limit,
            });
            const {data, error} = await result;
            if (error) {
              persist({
                content: error,
                type: "error",
                onActionClick: () => deleteCard(card),
                actionText: "retry",
              });
              return;
            }
            close();
          }}
        >
          <Box class={css({marginTop: "2rem"})}>
            <div class={css({marginBottom: "1rem"})}>
              Card type: <b>{card.blob.version}</b>
            </div>

            <ThemeInput
              label="Limit (USD)"
              value={limit}
              setValue={setLimit}
              type="number"
            />
            <ThemeInput
              label="Spent this month (USD)"
              value={card.blob.spent || "0"}
              type="number"
              disabled
            />
          </Box>
          <TextButton variant="shadow" mode="success">
            Save
          </TextButton>
        </Form>
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
  const [user] = useAuthState();
  const [name, setName] = useState(user.name);
  const [number, setNumber] = useState("");
  const [cvc, setCVC] = useState("");
  const [expires, setExpires] = useState("");
  const [focused, setFocused] = useState<"number" | "cvc" | "expiry" | "name">(
    null
  );
  const [zip, setZip] = useState<string>();
  const {persist} = useAlerts();
  const [type, setType] = useState("standard");
  async function handleSubmit() {
    if (
      !fns.validateCardNumber(number) ||
      !fns.validateCardExpiry(expires) ||
      !fns.validateCardCVC(cvc)
    ) {
      return;
    }
    const provider = fns.cardType(number);
    const month = expires.substr(0, 2);

    const year = expires.substr(2, 6).replace("/", "");
    const obj = {
      provider,
      name,
      version: type,
      number,
      cvc,
      expiry: fns.cardExpiryVal(`${month}/${year}`),
    };
    const {result} = addPhysicalCard(obj);
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
    close();
    fetchCards();
  }
  console.log(fns.cardType(number));
  const options = {
    amex: ["standard", "gold", "platinum"],
    visa: ["standard", "gold", "platinum", "infinite"],
    mastercard: ["standard", "world"],
  };
  return (
    <Modal active={active} onClickOutside={close} onEscape={close}>
      <Form onSubmit={handleSubmit}>
        <div class={css({padding: "2rem"})}>
          <CardInput
            cvc={cvc}
            expiry={expires}
            locale={{valid: "expires"}}
            name={name}
            number={number}
            focused={focused}
          />
          <Box class={css({marginTop: "2rem"})}>
            <ThemeInput
              value={name}
              setValue={setName}
              label="Name"
              onFocus={() => setFocused("name")}
            />
            <ThemeInput
              value={number}
              setValue={setNumber}
              label="Number"
              helperText="Invalid card"
              errored={number.length > 10 && !fns.validateCardNumber(number)}
              type="tel"
              onFocus={() => setFocused("number")}
            />
            <ThemeInput
              value={cvc}
              setValue={setCVC}
              label="CVC"
              pattern="\d+"
              maxLength={3}
              errored={cvc.length === 3 && !fns.validateCardCVC(cvc)}
              onFocus={() => setFocused("cvc")}
            />
            <ThemeInput
              errored={expires.length >= 4 && !fns.validateCardExpiry(expires)}
              value={expires}
              setValue={setExpires}
              label="Expiry"
              onFocus={() => setFocused("expiry")}
            />
            <ThemeInput value={zip} setValue={setZip} label="Zip" />
            {options[fns.cardType(number)] && (
              <Box>
                <select
                  class={css({background: "white", marginBottom: "1rem"})}
                  label="Type"
                  onChange={(e) => setType(e.currentTarget.value)}
                  value={type as any}
                >
                  <option selected disabled>
                    Select
                  </option>
                  {(options[fns.cardType(number)] ?? []).map((x: any) => (
                    <option value={x}>{x}</option>
                  ))}
                </select>
              </Box>
            )}
            <TextButton mode="success" variant="shadow">
              Add
            </TextButton>
          </Box>
        </div>
      </Form>
    </Modal>
  );
}
