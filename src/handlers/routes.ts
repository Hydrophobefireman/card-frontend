const BASE = location.href.includes("localhost")
  ? "http://localhost:5000"
  : (() => {
      throw new Error("not implemented");
    })();

function getURL(path: string) {
  return new URL(path, BASE).href;
}

export const loginRoute = getURL("/users/-/login");
export const registerRoute = getURL("/users/-/register");
export const refreshTokenRoute = getURL("/users/-/token/refresh");
export const initialAuthCheckRoute = getURL("/users/me");

export const getPhysicalCardsRoute = getURL("/users/cards/physical");
export const getVirtualCardsRoute = getURL("/users/cards/virtual");
export const putPhysicalCardsRoute = getPhysicalCardsRoute;
export const patchPhysicalCardsRoute = (id: string) =>
  getURL(`/users/cards/physical/${id}`);

export const deletePhysicalCardsRoute = patchPhysicalCardsRoute;

export const addVirtualCardRoute = getURL("/users/cards/virtual/create");
export const patchVirtualCardRoute = (id: string) =>
  getURL(`/users/cards/virtual/${id}`);
export const deleteVirtualCardRoute = patchVirtualCardRoute;
