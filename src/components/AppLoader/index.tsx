import {DelayedRender} from "~/components/DelayedRender";
import {client} from "~/util/bridge";

import {useState} from "@hydrophobefireman/ui-lib";
import {useMount} from "@kit/hooks";

export function AppLoader({children}: {children?: any}) {
  const [synced, setSynced] = useState(false);
  useMount(async () => {
    await client.syncWithServer();
    setSynced(true);
  });
  if (synced) return children;
  return <DelayedRender time={1000}>Loading...</DelayedRender>;
}
