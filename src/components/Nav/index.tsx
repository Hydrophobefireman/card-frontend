import {css} from "catom";
import {pointerEventsNone} from "~/style";
import {client} from "~/util/bridge";

import {A, useRef, useState} from "@hydrophobefireman/ui-lib";
import {Box} from "@kit/container";
import {Dropdown} from "@kit/dropdown";
import {UserCircleIcon} from "@kit/icons";

import {
  navActionButtonCls,
  navDropdownContainerCls,
  profileButtonCls,
} from "./nav.style";

export function Nav() {
  const [isOpen, setOpen] = useState(false);
  function toggle() {
    setOpen(!isOpen);
  }
  const dropdownParentRef = useRef<HTMLElement>();
  const dropdownSiblingRef = useRef<HTMLButtonElement>();
  async function handleLogout(e: JSX.TargetedMouseEvent<HTMLButtonElement>) {
    const {
      currentTarget: {},
    } = e;
    client.logout();
  }
  return (
    <Box
      row
      ref={dropdownParentRef}
      element="nav"
      horizontal="right"
      class={css({padding: "0.5rem"})}
    >
      <Box flex={1} row class={css({gap: "1rem"})}>
        <A href="/app/cards/physical">Physical Cards</A>
        <A href="/app/cards/virtual">Virtual Cards</A>
        <A href="/app/cards/transactions">Your Transactions</A>
      </Box>
      <button
        ref={dropdownSiblingRef}
        class={profileButtonCls}
        onClick={toggle}
        label="My Account"
      >
        <UserCircleIcon size={"2rem"} />
      </button>
      <Dropdown
        class={isOpen ? "" : pointerEventsNone}
        parent={dropdownParentRef}
        sibling={dropdownSiblingRef}
      >
        <Box horizontal="right">
          <Box class={navDropdownContainerCls(isOpen)} horizontal="left">
            <button
              onClick={handleLogout}
              data-action="logout"
              class={navActionButtonCls}
            >
              logout
            </button>
          </Box>
        </Box>
      </Dropdown>
    </Box>
  );
}
