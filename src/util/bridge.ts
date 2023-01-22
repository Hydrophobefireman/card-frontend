import {
  initialAuthCheckRoute,
  loginRoute,
  refreshTokenRoute,
} from "~/handlers/routes";
import {User} from "~/types/user";

import {Bridge, clear} from "@hydrophobefireman/flask-jwt-jskit";

const client = new Bridge<User>(null);

// change these according to your backend
client.setRoutes({
  loginRoute,
  refreshTokenRoute,
  initialAuthCheckRoute,
});
client.onLogout(async () => {
  sessionStorage.clear();
  await clear();
  // document.body.textContent = "";
  location.href = "/";
});

const {useAuthState, useIsLoggedIn} = client.getHooks();

const requests = client.getHttpClient();

export {useAuthState, useIsLoggedIn, requests, client};
