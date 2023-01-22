import {useAuthGuard} from "~/hooks/use-auth-guard";

export function SafeLayout({
  route = "/app",
  children,
}: {
  route?: string;
  children?: any;
}) {
  const isLoggedIn = useAuthGuard(route);
  if (!isLoggedIn) return <></>;
  return children;
}
