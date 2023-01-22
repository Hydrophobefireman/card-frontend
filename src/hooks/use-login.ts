import {client} from "~/util/bridge";
import {emailToUserId} from "~/util/email-to-user-id";

import {redirect} from "@hydrophobefireman/ui-lib";
import {useAlerts} from "@kit/alerts";

export function useLogin(setFormState: (a: "pending" | "idle") => void) {
  const {persist} = useAlerts();
  return async function login(user: string, password: string) {
    setFormState("pending");
    const {error} = await client.login(emailToUserId(user), password).result;
    setFormState("idle");
    if (error) {
      return persist({
        content: error,
        cancelText: "Okay",
        actionText: "retry",
        type: "error",
        onActionClick() {
          login(user, password);
        },
      });
    }

    return redirect("/app");
  };
}
