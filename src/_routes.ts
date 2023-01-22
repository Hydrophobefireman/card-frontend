import {Fragment, h, redirect, useEffect} from "@hydrophobefireman/ui-lib";
import {dynamic} from "@kit/router";
const RouteToPhysical = () => {
  useEffect(() => {
    redirect("/app/cards/physical");
  }, []);
  return h(Fragment);
};
export default {
  "/": dynamic(() => import("~/pages/Landing")),
  "/app": RouteToPhysical,
  "/app/cards": RouteToPhysical,
  "/app/cards/virtual": dynamic(() => import("~/pages/VirtualCards")),
  "/app/cards/physical": dynamic(() => import("~/pages/PhysicalCards")),
  "/app/cards/transactions": dynamic(() => import("~/pages/Transactions")),
  "/auth": dynamic(() => import("~/pages/Login")),
};
