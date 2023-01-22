import {useMemo} from "@hydrophobefireman/ui-lib";
import {Box} from "@kit/container";
import {useLocation} from "@kit/hooks";

import {Login} from "./Login";
import {Register} from "./Register";

export function Auth() {
  const location = useLocation();

  const params = useMemo(() => new URLSearchParams(location.qs), [location.qs]);
  const mode: "register" | "login" =
    params.get("mode") === "register" ? "register" : "login";

  return <Box>{mode === "login" ? <Login /> : <Register />}</Box>;
}
