import {Nav} from "~/components/Nav";
import {SafeLayout} from "~/components/SafeLayout";

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
  return (
    <Box>
      <Text.h1>Your transactions will show up here</Text.h1>
    </Box>
  );
}
