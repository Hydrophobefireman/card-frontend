import {User} from "~/types/user";
import {requests} from "~/util/bridge";
import {emailToUserId} from "~/util/email-to-user-id";

import {registerRoute} from "./routes";

export function register(email: string, name: string, password: string) {
  return requests.postJSON<{
    user_data: {user: User; accountKey: string; kv: string};
  }>(registerRoute, {email, name, user: emailToUserId(email), password});
}
